WITH word_counts as (
  select
    docid,
    word,
	count(1) as cnt
  from 
    tokenized
  group by
    docid, word
),
collected as (
  select 
    docid,
    collect_list(feature(translate(word,':','\;'),cnt)) as features
  from 
    word_counts
  where
    cnt >= 2
  group by 
    docid
  CLUSTER by rand(43) -- random shuffling
)
-- DIGDAG_INSERT_LINE
select
  collected.docid, collected.features, docs.contents
from
  collected join docs on (collected.docid = docs.docid)
;
