# Model/data format investigation - findings
## Review of some background info

### Two basic CF approaches
There are two basic approaches to collaborative filtering, user-based and item-based. 
(1) user-based recommends items to a user through finding similar users (from selected criteria) and recommending new items that the similar users liked
  - ex: Both Nick and Brock really liked Moneyball and The Big Short but they both really didn't like Cats (with James Corden). Thus, based on these preferences we can say that Nick and Brock are similar users. Brock also really liked the Steve Jobs movie he just watched with Kev, so the system recommends Steve Jobs to Nick.
 
(2) item-based recommends items to a user based on similar items.
  - ex: Ali really liked reading Shoedog (Phil Knight) and so did Kevin, but Nick thought it was just OK. Kevin also liked The Ride of a Lifetime (Bob Iger) and once again, Nick thought it was just OK. Based on this criteria, the system assumes these two books are pretty similar, we it recommends The Ride of a Lifetime to Ali.
  
### Two overarching techniques
There are also two overarching techniques for navigating data, memomory-based and model-based.
(1) memory-based involves finding similar users based on some distance metric
  - ex: cosine similarity (takes dot product of two vectors to find distance measured as angle between)
(2) model-based applies machine learning models to user's ratings datasets to predict how likely it is that a user would like anew item
  - ex: matrix factorization 
  
 
  
