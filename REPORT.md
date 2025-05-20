Hello! its Thomas here, I hope you like this approach to solve the Be-Take-Home Challenge.

I would like to share that the experience of making this project was very fun!

I knew from the beggining that I was going to use NestJS, with MongoDB and AWS SES. I also knew that I was going to use AWS for the deployment.

The first thing I did was to create a Base for the project and configure the basic things. I created the files for NestJS to work properly and the most basic version of the get stocks endpoint, taking care of the dependencies and fixing some basic problems of configuration. 
After the environment was configured, I started working more on the domain of the project. Creating algo basic versions of all the funcionalities of the project.

Eventually after some hours, I had the basic stuff working. So I started detailing some important aspects, such as environment variables, AWS SES config and usage, DTOs and pipes for validation, responde interceptors to format response and imporoving the endpoints functionality.

Once the hard coding was done, I dockerize the app and deployed on AWS.

For the deployment I used an ECS, ECR, Load balancers, Target groups, Route 53 and ACM. The architecture was very simple, with a single container running the NestJS app and a load balancer to route the traffic to the container, which target group manages the ssl configuration and redirection.

The experience if making this projects was really challenging because I got stuck in a lot of thigns.


That said, I would like to share some desitions making and assumptions I made during the project.
I compromised myself to finish this project in 1 day, this version of the project is an approximation and an attempt to be an MVP version. This project can be approached in many ways, but I didn't wanted to over-engineer the project, its objectives were very simple.

To make this proejct I needed to make some assumptions, and make some important decisions.

1. Users:
One of the most confusing thing was how to manage users without having a user authenticator service. Since you don't consider that as part of the challenge, I decided to use an approach without integrating any authentication process, so I decided to have a single user in the database, with acts as "Default user" all accross the project.
This API is built with the idea of who ever is using it, takes the default user place.

This functionality can be easily migrated to another approach, because it does not complicate the domain of the project, it only ignores the posibility for more users to exist, without compromising any data. The user is not a constant in the system, it exist in the database on a collection called "users" but we only use one document of that collection. The default user can be configured in the .env file with the DEFAULT_USER_ID variable. 


2. The GET Stocks endpoint:
Another challenge in this project was how to manage the stocks.

I didn't want to implement the pagination because it was not a requirement. And there started the challenge because on the endpoint of the Vendor API for getting the stocks, they had pagination implemented. I solved this by creating a recursive function that would get me all the pages on a plain array. The problem with that function is that it takes it a lot more time to respond.  
I didn't wanted to save the data on the database, because I believe that it is most expensive for the system to update the database each 5 minutes (taking into considering the point written on the Requirements file) than to use a recursive function and get all the pages. Why? depends on the volume. For this case I belive this is the best approach to do it.

What I did was to make sure that in the "Get Stocks" endpoint the user can use the nextToken to get the next page of the stocks. This paginatio allows me to improve the time response on that endpoint.
For the "Buy Stock" endpoint, I make an approarch that continues the serching of the pricing until it find it. In this case, in some cases the time response is slower, but I believe that in the 50% of the cases will be faster than the recursive function.


3.  The deployment:
I decided to use the AWS account of tradenethub for making the deployment. I hope that this doesn't represents a problem for you. I only used that account and domain because I have AWs credits on that account and I wanted to take advantage of them.
To deploy y dockerized the app with the standard dockerfile sugested NestJS docs.
Pushed the image to ECR, in a private repository.
Created a Task definition with the image uri and correct configuration for the app.  
Created an ECS Service and configure security groups, load balancers and target groups.
After all those services were created and connected, I configured the domain and subdomain, I also created a certificate for SSL authorization  on ACM and the A record on Route 53.
The last thing I did was to configure the target group to redirect always to https to ensure secure connection with the respected SSL certificate.


I hope I fit the expectations of the project, I am looking forward to work with you and learn from you.
Besides of the result or you desition to advance with me as a candidate, I am open to any feedback and suggestions of improvement on my code.

Best regards, Thomas.
