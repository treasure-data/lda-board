WITH ranked as (
  select
    label, word, lambda, 
    ROW_NUMBER() over (partition by label order by lambda desc) as rnk
  from 
    lda_model
),
hashed as (
  select 
    label, feature_hashing(feature(word, lambda), '-features ${pca_hashspace}') as feature
  from
    ranked
  where
    rnk <= ${pca_topk_lambda}
)
-- DIGDAG_INSERT_LINE
select
  label,
  to_dense_features(collect_list(feature),${pca_hashspace}+1) as lambda -- +1 for zero-indexed bias clause
from
  hashed
group by
  label