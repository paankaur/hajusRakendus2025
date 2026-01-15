---
title: Comments Service Guide
---
## Overview

The Comments service manages comments for posts and emits events to the Event Bus. Comments are moderated by the Moderation service.

## Local Development

### Navigate to comments directory

```bash
cd comments
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
nodemon index.js
```

### Server runs on

http://localhost:5002

&nbsp;

<SwmSnippet path="/comments/index.js" line="10">

---

This stores the comments (for posts)

```javascript
let comments = []; // in-memory storage
```

---

</SwmSnippet>

&nbsp;

<SwmSnippet path="/comments/index.js" line="13">

---

POST method, sends data to event-bus

```javascript
app.post("/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  const comment = { id: Date.now(), postId, text: text.trim() };
  comments.push(comment);

  axios
    .post("http://event-bus-srv:5003/events", { // Event Bus service in Kubernetes
      type: "CommentCreated",
      data: comment,
    })
    .then(() => {
      console.log("Event emitted: CommentC-C-Created");
    })
    .catch((err) => {
      console.error("Failed to emit CommentCreated event:", err.message);
    });
  res.json(comment);
});
```

---

</SwmSnippet>

&nbsp;

<SwmSnippet path="/comments/index.js" line="35">

---

GET method for a single comment via ID

```javascript
app.get("/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;

  res.json(comments.filter((c) => c.postId === postId));
  console.log(comments);
});
```

---

</SwmSnippet>

## DELETE Method

```javascript
app.delete("/comments", (req, res) => {
  comments = [];
  console.log("All comments deleted");
  res.sendStatus(200);
});
```

Deletes all comments from memory.

## Event Handling

The service listens for events from the Event Bus:

```javascript
app.post("/events", (req, res) => {
  console.log("Received Event:", req.body);
  res.json({});
});
```

## Kubernetes Deployment

### Build and push Docker image

```bash
docker build -t paankaur/comments:latest ./comments
docker push paankaur/comments:latest
```

### Deploy to Kubernetes

```bash
kubectl apply -f infra/k8s/comments-depl.yaml
```

### Service Details

- **Port**: 5002
- **Service Name**: `comments-srv`
- **Type**: ClusterIP (internal only)
- **Endpoints**:
  - `POST /posts/:postId/comments` - Create a comment
  - `GET /posts/:postId/comments` - Get comments for a post
  - `DELETE /comments` - Delete all comments
  - `POST /events` - Receive events from Event Bus

### Access via Ingress

The service is accessible through the ingress at:
- `http://blog.local/posts/{postId}/comments` (POST/GET)

### Integration

Comments are automatically moderated:
1. Comment created → Event emitted to Event Bus
2. Moderation service checks for banned words (e.g., "orange")
3. Status updated to "approved" or "rejected"
4. Query service maintains aggregated view with moderation status

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBaGFqdXNSYWtlbmR1czIwMjUlM0ElM0FwYWFua2F1cg==" repo-name="hajusRakendus2025"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
