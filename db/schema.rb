# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_09_13_064956) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "datasets", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "workflow_id"
    t.integer "attempt_id"
    t.integer "session_id"
    t.integer "td_account_id"
    t.integer "td_user_id"
    t.index ["td_account_id"], name: "index_datasets_on_td_account_id"
    t.index ["td_user_id"], name: "index_datasets_on_td_user_id"
  end

  create_table "lda_models", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "dataset_id"
    t.integer "label"
    t.string "word"
    t.decimal "lambda", precision: 9, scale: 6
    t.index ["dataset_id"], name: "index_lda_models_on_dataset_id"
  end

  create_table "predicted_topics", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "dataset_id"
    t.string "docid"
    t.integer "topic1"
    t.decimal "proba1", precision: 9, scale: 6
    t.jsonb "contents"
    t.index ["dataset_id"], name: "index_predicted_topics_on_dataset_id"
  end

  create_table "topics", force: :cascade do |t|
    t.decimal "x", precision: 9, scale: 6
    t.decimal "y", precision: 9, scale: 6
    t.decimal "frequency", precision: 9, scale: 6
    t.bigint "dataset_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "topic_id"
    t.index ["dataset_id"], name: "index_topics_on_dataset_id"
  end

  create_table "users", force: :cascade do |t|
    t.integer "td_user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "td_account_id"
    t.index ["td_user_id"], name: "index_users_on_td_user_id"
  end

  add_foreign_key "lda_models", "datasets"
  add_foreign_key "predicted_topics", "datasets"
  add_foreign_key "topics", "datasets"
end
