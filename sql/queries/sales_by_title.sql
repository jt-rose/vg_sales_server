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
-- find single with filter options
SELECT *
FROM games
WHERE title = :title -- or Like?
    AND year_of_release = :year -- what about range?
    AND console = :console
    AND genre = :genre
    AND rating = :rating
    AND publisher = :publisher
LIMIT :limit;
-- with pagination
SELECT *
FROM (
        SELECT *,
            ROW_NUMBER() OVER (
                ORDER BY tempo.global_sales DESC
            ) as row_n
        FROM (
                SELECT sum(global_sales) AS global_sales,
                    sum(na_sales) AS na_sales,
                    sum(eu_sales) AS eu_sales,
                    sum(jp_sales) AS jp_sales,
                    sum(other_sales) AS other_sales,
                    title
                FROM games
                GROUP BY title
                ORDER BY global_sales DESC
            ) as tempo
    ) as with_row_n
where with_row_n.row_n between 1 and 10