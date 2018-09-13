class FetchResultFromTdJob < ApplicationJob
  queue_as :default

  def perform(td_api_key, current_dataset)
    Rails.cache.write("/datasets/#{current_dataset.id}/fetch_status", "working")

    @api_key = td_api_key
    @dataset = current_dataset

    @client = TreasureData::Client.new(td_api_key, {
      endpoint: ENV["TD_API_SERVER"]
    })

    @dbname = get_target_dbname

    begin
      fetch_lda_model()
      fetch_principal_component()
      fetch_predicted_topics()
  
      current_dataset.touch
      current_dataset.save
    rescue => e
      p e
      Rails.cache.write("/datasets/#{current_dataset.id}/fetch_status", "failed")
      return
    end

    Rails.cache.write("/datasets/#{current_dataset.id}/fetch_status", "completed")
  end


  private

  def get_target_dbname
    conn = Faraday.new
    res = conn.get "#{ENV["TD_WORKFLOW_SERVER"]}/api/attempts/#{@dataset.attempt_id}/tasks" do |req|
      req.headers['Authorization'] = "TD1 #{@api_key}"
      req.headers['Content-Type'] = 'application/json'
    end

    _tasks = JSON.parse(res.body)['tasks'] || []
    _parentTask = _tasks.select {|t| t['parentId'].nil?}
    _parentTask.first['config']['_export']['dbname']
  end

  def fetch_lda_model
    query = <<-EOS
      WITH ranked as (
        SELECT
          label,
          word,
          lambda,
          ROW_NUMBER() over (partition by label order by lambda desc) as rnk
        FROM 
          \"#{@dataset.session_id}_lda_model\"
      )
      SELECT
        label, word, lambda
      FROM
        ranked
      WHERE
        rnk <= 20
      ORDER BY
        label, lambda DESC
    EOS

    job = @client.query(@dbname, query, nil, nil, nil, {type: :presto})
    until job.finished?
      sleep 2
      job.update_progress!
    end
    job.update_status!

    @dataset.lda_models.delete_all
    lda_models = []
    job.result_each do |row|
      lda_models << @dataset.lda_models.new(
        label: row[0],
        word: row[1],
        lambda: row[2],
      )
    end

    @dataset.lda_models.import(lda_models)
  end

  def fetch_principal_component
    query = <<-EOS
      SELECT
        index, x, y, proportion
      FROM
        \"#{@dataset.session_id}_principal_component\"
        join
        \"#{@dataset.session_id}_topic_proportion\"
        on
        (\"#{@dataset.session_id}_principal_component\".index = \"#{@dataset.session_id}_topic_proportion\".topic)
    EOS

    job = @client.query(@dbname, query, nil, nil, nil, {type: :presto})
    until job.finished?
      sleep 2
      job.update_progress!
    end
    job.update_status!
    @dataset.topics.delete_all
    topics = []

    job.result_each do |row|
      topics << @dataset.topics.new(x: row[1], y: row[2], topic_id: row[0], frequency: row[3])
    end

    @dataset.topics.import(topics)
  end

  def fetch_predicted_topics
    query = <<-EOS
      WITH ranked as (
        SELECT
          topic1 as topicid,
          docid,
          proba1 as proba,
          contents,
          ROW_NUMBER() over (partition by topic1 order by proba1 desc) as rnk
        FROM 
          \"#{@dataset.session_id}_predicted_topics\"
      )
      SELECT
        topicid, docid, proba, contents
      FROM
        ranked
      WHERE
        rnk <= 20
      ORDER BY
        topicid, proba DESC
    EOS
    job = @client.query(@dbname, query, nil, nil, nil, {type: :presto})

    until job.finished?
      sleep 2
      job.update_progress!
    end
    job.update_status!
    @dataset.predicted_topics.delete_all
    predicted_topics = []
    job.result_each do |row|
      predicted_topics << @dataset.predicted_topics.new(
        docid: row[1],
        topic1: row[0],
        proba1: row[2],
        contents: row[3]
      )
    end

    @dataset.predicted_topics.import(predicted_topics)
  end
end









# # fetch lda_model



# # fetch principal_component


# # fetch predicted_topics

