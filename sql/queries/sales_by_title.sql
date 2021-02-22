-- find top 10 games, limiting to each console version
SELECT *
FROM games
ORDER BY global_sales DESC
LIMIT 10;
-- select top 10 selling titles, combining sales across platforms
SELECT sum(global_sales) AS global_sales,
    sum(na_sales) AS na_sales,
    sum(eu_sales) AS eu_sales,
    sum(jp_sales) AS jp_sales,
    sum(other_sales) AS other_sales,
    title
FROM games
GROUP BY title
ORDER BY global_sales DESC
LIMIT 10;
-- select crossplatform sales for specific title
SELECT sum(global_sales) AS global_sales,
    sum(na_sales) AS na_sales,
    sum(eu_sales) AS eu_sales,
    sum(jp_sales) AS jp_sales,
    sum(other_sales) AS other_sales,
    title
FROM games
GROUP BY title
HAVING title = :title;