-- find global sales for multiplatform titles
SELECT sum(global_sales) as global_sales_all_consoles,
    sum(na_sales) as na_sales_all_consoles,
    sum(eu_sales) as eu_sales_all_consoles,
    sum(jp_sales) as jp_sales_all_consoles,
    sum(other_sales) as other_sales_all_consoles,
    title
FROM games
GROUP BY title;
-- select global sales for specific title
SELECT sum(global_sales) as global_sales_all_consoles,
    sum(na_sales) as na_sales_all_consoles,
    sum(eu_sales) as eu_sales_all_consoles,
    sum(jp_sales) as jp_sales_all_consoles,
    sum(other_sales) as other_sales_all_consoles,
    title
FROM games
GROUP BY title
HAVING title = :title;