# Chat Application

## Activity Part

### Endpoints in the api

- **/activities** : endpoint to access all activities as well as create a new activity. Also support uploading of file.

- **/activities/id** : endpoint to access a particular activity,update an activity ,delete an activity.

  - id : A valid mongoDB id of post or activity.

- **/activities/activities-within/:distance/center/:latlng/unit/:unit** : endpoint to get activities which are within a range of certain kilometer.<br>
  - distance : define distance to which search is needed to be made.
  - latlong : latitude and longitue separated by **,**
  - unit : km for kilometers or mi for miles
- **/activities/:id/votes/:type** : enpoint for upvoting and downvoting a particular post
  - id : A valid mongoDB id of post or activity.
  - type : 1 for upvote or -1 for downvote

### Data that can be posted and updated

- title
- location: {
  coordinates: [longitude,latitude]
  }
- description
- file
- likes: No of likes
- tags: eg. #tech#code
- eventType: Can be any of the following only

  - LOST & FOUND
  - BUY & SALE
  - EVENTS
  - ACTIVITY
  - NEWS
  - OPPORTUNITY
  - MISCELLANEOUS

- votes:
  - up: Number of upvotes
  - down: Number of downvotes

## Authentication Part

### Endpoints in the api

- **/auth/generate-otp**

  - generate otp require for verification.
  - Accept post request with mobile number as data

- **/auth/verify-otp** :
  - verify otp
  - Accept post request with mobile number and otp as data

---


Comments Route
--------------

### Note

#### Url can be "localhost:500/activities or herokuUrl/activities"

#### Method means http request type that you need to select like post,get,patch,delete

#### id means commentId

#### count is used for pagination, value starts from 1 (count can't be 0) and it will give count*20 comments

#### Get all reply belong to a particular comment will be uploaded soon


* * * * *

#### Endpoints

-   get all comments(method:get): [Url/comments/:activity\_id/:count]()

-   Delete all comments(method:delete): [Url/comments/:activity\_id]()

-   Posting single comment(method:post): [Url/comments/:activity\_id]()

-   Delete single comment(method:delete):
    [Url/comments/:activity\_id/:id]()
    
-   Update single comment(method:patch):
    [Url/comments/:activity\_id/:id]()

##### Replies

##### Note: Reply is also a type of comment, so first delete or update the comment(=reply) from the main schemea of the comment with the help of endpoints mentioned above, below endpoints will just alter the reference of the reply in the comments of the particular activity. 
* * * * *

-   Delete single reply(method:delete):
    [Url/comments/reply/:activity\_id/:id/:reply\_id]()
-   Update single reply(method:patch):
    [Url/comments/reply/:activity\_id/:id/:reply\_id]()



Any request sent to the server must have an authorization header with value of user id and it should start with Bearer.
eg:

> authorization : 'Bearer f8f1b5078815fc12bf7e211785c4771c32e2bf7d8e4bd8743cbac172aae53896ed03e032e76911ba29971c080e8da99be6a00434de95adc134eb6c55ffbd9b0b9511b3610225253c825b39ccd6c98da55846bd494803081098d6774657ee8608dcef6544d960353733ef757b48cf9370ffd3efdea11c3c54'
