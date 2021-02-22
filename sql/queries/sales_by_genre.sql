-- rank genres by total sales across titles
SELECT sum(global_sales) as global_sales_by_genre,
    sum(na_sales) as na_sales_by_genre,
    sum(eu_sales) as eu_sales_by_genre,
    sum(jp_sales) as jp_sales_by_genre,
    sum(other_sales) as other_sales_by_genre,
    genre
FROM games
GROUP BY genre
ORDER BY global_sales_by_genre DESC;