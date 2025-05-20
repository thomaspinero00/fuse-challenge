# Reporting File 

Hello! its Thomas here, I hope you like this approach to solve the Be-Take-Home Challenge.

I would like to share that the experience of making this project was very challenging and fun!

#

### Architecture

The following is a representation of the project's arquitecture.

![Architecture Image.](https://fuse-challenge.s3.us-east-1.amazonaws.com/WhatsApp+Image+2025-05-20+at+3.52.36+PM.jpeg)
#

### Infraestructure

The following is a diagram with the infraestructure scheme of the Project.

![Infrastructure Image.](https://fuse-challenge.s3.us-east-1.amazonaws.com/WhatsApp+Image+2025-05-20+at+4.30.54+PM.jpeg)

#

### Experience with the project:

The first thing I did was to setup a base for the project and configure the basic things. I created the files for NestJS to work properly and the most basic version of the get stocks endpoint, taking care of the dependencies and fixing some basic problems of configuration. 
After the environment was configured, I started working more on the domain of the project. Creating also basic versions of all the funcionalities of the project.

Eventually after some hours, I had the basic stuff working. So I started detailing some important aspects, such as environment variables, AWS SES config and usage, DTOs and pipes for validation, interceptors to format response and imporoving the endpoints functionality.

Once the hard coding was done, I dockerized the app with the standard dockerfile sugested by NestJS docs and deployed it on AWS ECS.

For the first deployment I used an ECS, ECR, Load balancers, Target groups, Route 53 and ACM. The architecture is very simple, with a single container running the NestJS app and a Load Balancer to route the traffic to the container, which target group manages the ssl configuration and redirection.

For solving the challenges of this project, I had to make some assumptions, and some important decision making.

#### 1. Users:
One of the most confusing thing was how to manage users without having a user authenticator service. Since you don't consider that as part of the challenge, I decided to use an approach without integrating any authentication process, so I decided to have a unique user in the database, which acts as _Default user_ all accross the project.
This API is built with the idea of who ever is using it, takes the _Default user_ place.

This functionality can be easily migrated to another approach and easily integrated with more services, because it does not compromise the domain of the project, it only ignores the posibility for more users to exist, without compromising any data. The user is not a constant in the system, it exist in the database on a collection called `users` but we only use 1 document of that collection. The default user can be configured in the `.env` file with the `DEFAULT_USER_ID` variable. 


#### 2. The GET Stocks endpoint:
Another challenge in this project was how to operate with the stocks data.

I didn't want to save the data on the database and I wanted the user to have all the stocks at once, without pagination. And there started the challenge because on the endpoint of the Vendor API for getting the stocks, they have a "batchs" system. I solved this by creating a recursive function that would get me all the pages on a plain array. The problem with that function is that it takes it a lot more time to respond.  
For this reason I implemented Redis to cache the stocks and keep the data updated, btw I didn't want to save the data on de db because the data changes every 5 minutes, so what I did was to create a cache service that is updated every 5 minutes and with a time to live of 6 minutes. This way the information is not duplicated (at least not permanently) and we optimize the application to respond faster.


#### 3.  The deployment:
Note: _I decided to use the AWS account of tradenethub for making the deployment. I hope that this doesn't represents a problem for you. I used that account and domain because I have AWS credits on that account and I have to take advantage of them._

After all the services were created and connected, the stocks issue made me deal with an infrastructure problem. 
The Redis instance relays on Docker for development.
The challenge was to create a Redis instance on AWS and connect it to my service. After facing a lot of errors with AWS ElasticCache and after a lot of research and chatting with the IA, I solved the issue by creating the Redis instance in Amazon MemoryDB and connect the service to it, this part was very challenging but at the and I was able to connect the services successfuly. 


#

### Deployed Version

If you want to try the deployed version, you can access it here:

 `https://fuse-challenge-api.tradenethub.com/api`

Here is a very resumed documentation of the API:

#### Api Key:
You should add the api key to the header `x-api-key` with the value `Ul6OHfWEzrKVO2hp`

The API has the following endpoints

#### GET: /health
   No api token required, returns the service status.

#### GET: /portfolio/my-portfolio
Returns your portfolio.

#### GET: /stocks
Returns the list of available stocks.
    
    

#### POST: /stocks/buy-for-myself
You can buy a stock and add it to your portfolio with the body. Returns an empty object.

```
{
"symbol": "AAPL",
"quantity": 100,
"purchasePrice": 1000
}
```

#

I hope it fits the expectations of the project, I am looking forward to work with you and learn from you.

Besides of the result or you desition to advance with me as a candidate, I am open to any feedback and suggestions of improvement on my code.

Thank you very much in advance.

Best regards, Thomas.


