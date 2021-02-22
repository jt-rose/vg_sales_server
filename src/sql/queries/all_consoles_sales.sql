SELECT sum(global_sales) as global_sales_all_consoles,
    title
FROM games
GROUP BY title