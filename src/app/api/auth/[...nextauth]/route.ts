export { GET, POST } from "@auth";

//generally we dont create these route handlers but when whenever we need some outside
// server to access our app programmatically then yes.
//Github servers are going to try to reach out to our application to handle authentication
//at specific points in time.
