SELECT id, name FROM categories;

SELECT id, name FROM categories
JOIN articles_categories ON id = category_id
GROUP BY id;

SELECT id, name, COUNT(article_id) FROM categories
LEFT JOIN articles_categories ON id = category_id
GROUP BY id;

SELECT a.id, a.title, a.announce, a.created_at,
    COUNT(comments.id) AS comments_count,
    STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
    users.first_name,
    users.last_name,
    users.email
FROM articles a
JOIN articles_categories ON a.id = articles_categories.article_id
JOIN categories ON articles_categories.category_id = categories.id
LEFT JOIN comments ON comments.article_id = a.id
JOIN users ON users.id = a.author_id
GROUP BY a.id, a.created_at, users.id
ORDER BY a.created_at DESC;

SELECT a.*,
    COUNT(comments.id) AS comments_count,
    STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
    users.first_name,
    users.last_name,
    users.email
FROM articles a
JOIN articles_categories ON a.id = articles_categories.article_id
JOIN categories ON articles_categories.category_id = categories.id
LEFT JOIN comments ON comments.article_id = a.id
JOIN users ON users.id = a.author_id
WHERE a.id = 1
GROUP BY a.id, users.id;

SELECT
    c.id,
    c.article_id,
    users.first_name,
    users.last_name,
    c.text
FROM comments c
JOIN users ON c.user_id = users.id
ORDER BY c.created_at DESC
LIMIT 5;

SELECT
    c.id,
    c.article_id,
    users.first_name,
    users.last_name,
    c.text
FROM comments c
JOIN users ON c.user_id = users.id
WHERE c.article_id = 1
ORDER BY c.created_at DESC;

UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 3;
