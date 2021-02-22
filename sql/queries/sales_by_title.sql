-- find top 10 games, limiting to each console version
SELECT *
FROM games
ORDER BY global_sales DESC
LIMIT 10;
-- select top 10 selling titles, combining sales across platforms
SELECT sum(global_sales) AS global_sales_crossplatform,
    sum(na_sales) AS na_sales_crossplatform,
    sum(eu_sales) AS eu_sales_crossplatform,
    sum(jp_sales) AS jp_sales_crossplatform,
    sum(other_sales) AS other_sales_crossplatform,
    title
FROM games
GROUP BY title
ORDER BY global_sales_crossplatform DESC
LIMIT 10;
-- select crossplatform sales for specific title
SELECT sum(global_sales) AS global_sales_crossplatform,
    sum(na_sales) AS na_sales_crossplatform,
    sum(eu_sales) AS eu_sales_crossplatform,
    sum(jp_sales) AS jp_sales_crossplatform,
    sum(other_sales) AS other_sales_crossplatform,
    title
FROM games
GROUP BY title
HAVING title = :title;