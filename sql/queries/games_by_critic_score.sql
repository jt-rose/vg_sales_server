-- sort by highest critic score
select *
from games
where critic_score is not null
order by critic_score DESC
limit 10;
-- sort by highest user score
select *
from games
where user_score is not null
order by user_score DESC
limit 10;