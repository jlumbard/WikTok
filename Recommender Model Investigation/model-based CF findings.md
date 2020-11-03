# Findings for model based CF

### exploration of matrix factorization in a recommender engine
![](moviewatchers.png)

#### find dependencies in the matrix
- rows 1 and 3 are exactly the same, so those two users have the same preferences
- column 1 and column 4 are exactly the same, so movie 1 and movie 4 are similar movies and have similar ratings (Mall Cop - Paul Blart & Observe and Report - Seth Rogen)
- rows 2 and 3 add to row 4, so user 4 enjoys both the preferences of user 2 and user 3. (ex: user 2 likes action movies, user 3 likes comedy movies, user 4 likes comedy and action movies)
- column 5 is the average of columns 2 and 3. m2 could be twister (tornado movie), m3 could be jaws, m5 would both - sharknado. if you hate sharks and hate tornados, then you'll hate sharknado (row 1). If you like sharks and you like tornados, then you'll like sharnado (row 4). If you like sharks and don't really like tornados, then you'll only somewhat like sharnado.

#### we use matrix factorization to figure out these dependencies that allow us to predict ratings



