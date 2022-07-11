# Starter Kit for Caching Rest APIs

This repo highlights how a user would cache APIs with Hasura. There are three different ways you can bring REST APIs into Hasura:

1. Hasura actions
2. Hasura remote schemas + OpenAPI-to-GraphQL
3. Use Hasura as a cache

The below diagram illustrates the three different methodologies:

![hasura architecture diagram](./static-images/hasura-rest-diagram.png?raw=true)

## Setup

### <u>Hasura</u>

Ensure you have the Hasura CLI downloaded: <https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli/>

1. `docker-compose up -d`
2. `cd /hasura`
3. `hasura metadata apply`
4. `hasura migrate apply`
5. `hasura metadata clear`
6. `hasura metadata apply`

### <u>Node</u>

1. `cd /data-sync-api`
2. `npm install`
3. `npm run dev`

## Hasura Cached APIs

Caching Rest APIs into Hasura provides two main benefits:

1. It allows users the ability to perform fine-grained authorization within Hasura on the cached REST API models/tables.

2. It can increase read performance

### Caching Process Overview

The flow starting at the far right of the above diagram **_labeled example 3_**, illustrates how caching REST APIs is enabled within Hasura. The process can be broken down into four steps:

1.  The process begins through REST API events which are inserted into a business object event table created within Hasura. In other words, Hasura needs to consume events from a change data capture mechanism of the target API you intend to cache. That event payload is then stored in a table named business object events. The business object events table has the following schema:

    - **_event_id_**: The id of the event
    - **_name_**: The name of the event, which is used as an identifier of the target API
    - **_operation_**: The operation type of the event (insert, delete, update)
    - **_object_id_**: The primary key of the row affected by the event
    - **_created_at_**: A timestamp value created automatically on event insert.
    - **_finished_at_**: A timestamp value created automatically when an event is successfully cached. Finished_at in combination with created_at can be used to calculate the latency of caching a value.

2.  The business objects events table has an event trigger on it that will send the event payload to a lambda function (entitled synchronizer/dispatcher in the diagram)

3.  The lambda function is responsible for updating the cached tables within Hasura. The lambda will update the cache based on the operation type of the API event inserted into the business object table. If the event operation type is of type **insert or update**, it will fetch the record from the underlying API using **object_id**.

4.  The lambda function will then upsert the record retrieved from the underlying API into the specific cached model table within Hasura. If the event was of operation deletion, then the Lambda function would simply delete the record from the cached table.

### Starter Kit End-to-End Example

We recommend following the below process when using the starter kit:

1. Create a cached model table within Hasura, the schema should be mapped to the table columns of the underlying API’s data source that you intend to cache. For example, let’s say we want to cache an Employee API and the values that we want to cache are the _id, first name, last name, and birth date_ of an employee. We would create the following table within Hasura:

![hasura architecture diagram](./static-images/End-to-End-Step-1.png?raw=true)

2. Navigate to the synchronizers directory located at _/starter-kit-rest-sources/src/utils/_ types and create an interface type that corresponds to the table created in the previous step.

![hasura architecture diagram](./static-images/End-to-End-Step-2.png?raw=true)

3. Follow Steps:

- a.) Navigate to the synchronizer directory located at _/starter-kit-rest-sources/src/synchronizers_

- b.) Create a **_{input-model-name}Sychronizer.ts_** file

![hasura architecture diagram](./static-images/End-to-End-Step-3b.png?raw=true)

- c.) Within the file created in the above step, create a fetchById function that fetches data using the object_id from the events payload and returns an instance of the cached-model-type.

![hasura architecture diagram](./static-images/End-to-End-Step-3c.png?raw=true)

- d.) Create a mutation that upserts a value of cached-model-type into the cached model table.

![hasura architecture diagram](./static-images/End-to-End-Step-3d.png?raw=true)

- e.) Create a mutation that deletes a value of cached-model-type from the cached model table

![hasura architecture diagram](./static-images/End-to-End-Step-3e.png?raw=true)

- f.) Export the functions as a provider

![hasura architecture diagram](./static-images/End-to-End-Step-3f.png?raw=true)

4. Navigate to index.ts located at _/starter-kit-rest-sources/src/synchronizers/index.ts_. Add the newly created provider to the config map. The key should correspond to the name of the API event that is emitted to Hasura and stored within the business_object_events name column.

![hasura architecture diagram](./static-images/End-to-End-Step-4.png?raw=true)

5. Try manually inserting an event into the business_object_events table. If everything is working correctly, it will automatically cache the record in the cached model table:

![hasura architecture diagram](./static-images/End-to-End-Step-5a.png?raw=true)

![hasura architecture diagram](./static-images/End-to-End-Step-5b.png?raw=true)

## Hasura Actions & Remote Schemas

Please see the below repo for starter kit examples showing actions & remote schemas:

<https://github.com/hasura/rest-api-examples>
