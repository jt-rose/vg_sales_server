-- rank genres by total sales across titles
SELECT sum(global_sales) as global_sales,
    sum(na_sales) as na_sales,
    sum(eu_sales) as eu_sales,
    sum(jp_sales) as jp_sales,
    sum(other_sales) as other_sales,
    genre
FROM games
GROUP BY genre
ORDER BY global_sales DESC;