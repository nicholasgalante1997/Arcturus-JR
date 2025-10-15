---

---

In this article, I am going to present a deep dive on this application's architecture, where I will, _boastfully_, propose that React is better without frameworks. Now I know that _better_ is largely subjective and situational, but I will propose it across several categories, which may help to better elicit it's advantages in a non-arbitrarian way:

1. Developer Experience
2. Security
3. Long Term Maintainability
4. **Performance**
5. Fine tuned control of all parts of the technical stack

It would be great to dive into these immediately, but there's likely a greater value here in examining the state of React frameworks today, and then moving into an examination of this application's architecture, _then_ moving into a discussion on the above.

## The Sorry State of React Frameworks

I am disclosing now that I am as biased against modern react frameworks as a developer can be. I am the last thing a react framework sees, before it is banished from an enterprise web application architcture. I have such a strong opinion against the usage of frameworks, more specifically **next.js**, and less specifically all server side React frameworks.  

At scale, I have watched next.js become a monumental bottleneck. For several years, while employed with Amazon Games before moving into R&D, I supported the digital fulfillment and entitlement services for digital products on Amazon, and that scope would eventually grow to include frontend/fullstack work on the Digital Goods Detail and Checkout Pages, which were composed as SSR'd React Pages within a next.js framework. As you can imagine, we had an ample amount of custom server logic that we required for observability and metrics, as well as coordinating with things like Weblab (Blue/Green deployment software infrastructure) to determine the correct states/versions of views to render, and being coerced into next.js's patterns for custom server rendering definitely felt arduous in places, where we knew we could patterns we liked better if we had full 