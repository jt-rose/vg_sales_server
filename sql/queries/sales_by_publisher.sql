SELECT sum(global_sales) AS global_sales,
    sum(na_sales) AS na_sales,
    sum(eu_sales) AS eu_sales,
    sum(jp_sales) AS jp_sales,
    sum(other_sales) AS other_sales,
    publisher
FROM games
GROUP BY publisher
ORDER BY global_sales DESC
LIMIT 10;