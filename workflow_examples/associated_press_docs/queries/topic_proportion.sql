WITH doc_length as (
  select docid, cardinality(features) as freq from input
),
doc_topic_dists as (
  select docid, topic1, proba1 from predicted_topics order by docid
),
topic_freq as (
  select topic1, (freq * proba1) as pp
  from doc_length join doc_topic_dists on (doc_topic_dists.docid = doc_length.docid)
)

select topic1 as topic, sum(pp) / (select sum(pp) from topic_freq) as proportion
from topic_freq
group by topic1 order by topic1;
