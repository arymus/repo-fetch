import { useState, useRef, type ReactElement } from 'react'; // Import the useState function from React

/*
 * UseState is what's known as a React hook.
 * The useState hook allows functional components to maintain a state, and is identified by the first variable while the second is a function called to update it.
 */
const [user, setUser] = useState<string>(""); // Create a useState to hold the user's username

// Asynchronous function to get the repositories, which takes a string username and returns a promise that can be a response or unkown
async function fetchRepositories(username: string): Promise<Response | unknown> {

  // Try to run this code and catch any errors
  try {

    /*
     * Send an HTTP request to the URL with the fetch() function.
     * The value that fetch() returns is a Promise, which is an object representing the outcome of an asynchronous operation.
     * Promises can either be fulfilled, pending, or rejected.
     * Fulfilled is a success, pending is when the promise is still waiting for a response, and rejected is when the promise returns an error.
     * The await keyword stops the function until the promise returned by fetch() is either fulfilled or rejected.
     * The Response type of the response variable represents the Response object, which holds HTTP response data.
     */
    const response: Response = await fetch(`api.github.com/users/${username}/repos`);
    if (!response.ok) throw new Error("HTTP error! Status code: " + response.status); // If the response is NOT OK (didn't return 200), throw an HTTP error inside the Error object

    const data = await response.json(); // Take the data from the response object and parse it to JSON
    return data; // Return the data

    // Catch any errors and assign them to the err variable, which is unknown
  } catch (err: unknown) {
    return err; // Return the error
  };
};

// A functional component that displays a repository
function Repo(props: { name: string; styles: string; link: string }) {
  return (
    <li className={props.styles}>
      <a href={props.link}>
        {props.name}
      </a>
    </li>
  );
};

// Functional component that
function RepoList() {
  const repositories: Promise<Response | unknown> = fetchRepositories(user); // Call fetchRepositories() with the user passed to it

  const styles = "";
  /*
   * 1. Create a <ul> to hold the repositories
   * 2. Create an array containing objects containing the repository data
   * 3. Create <li> elements holding the repository data for each repository
   * 4. Append the <ul> to the DOM
   */
  const listItems: Array<ReactElement> = [];

  for (repo in repositories) {
    listItems.push(<Repo name={repo["name"]} link={repo["link"]} styles={styles} />);
  };

  return (
    <ul>
      {listItems}
    </ul>
  )
}


// The component that displays the UI
function App() {

  /*
   * useRef is another React hook.
   * The useRef hook gives functional components a place in the React DOM, which we can use to configure them in our code like we would with normal HTML.
   */
  const submitButton = useRef<HTMLInputElement>(null); // Make a ref that represents an <input> element, specifically the submit button
  const userInput = useRef<HTMLInputElement>(null); // Make a ref that represents an <input> element, specifically the username input

  // All the variables containing the styles for each element
  const titleStyle: string = "text-center text-white font-bold text-3xl";
  const descStyle: string = "text-center text-gray-500 text-1xl";

  const formStyle: string = "flex justify-center align-center m-10";
  const userInputStyle: string = "p-3 bg-[#151b23] text-white placeholder:text-gray-500 rounded-l-2xl";
  let submitStyle: string = "p-3 bg-[#151b23] text-white rounded-r-2xl";
  // const repoListStyle = "p-10 bg-[#151b23]";

  // Function that focuses on two elements
  const highlightElement =

    // Ref and self are React Ref objects that can either represent an HTML <input> element or null, and since there's no return statement the function returns undefined
    (ref: React.RefObject<HTMLInputElement | null>, self: React.RefObject<HTMLInputElement | null>): undefined => {
      const refElement: HTMLInputElement | null = ref.current; // Create a variable to hold ref.current

      // If the element associated with ref exists
      if (refElement) {

        // Replicate focus styles on the element that was NOT originally focused on
        refElement.style.border = "2px solid white";
        refElement.style.borderLeft = "2px solid #151b23";
      };

      // If the originally focused element exists
      if (self.current) self.current.focus(); // Focus on the originally focused element (without this the original element would go out of focus, aka blur)
    };

  // Function to blur on two elements (note that blur is to go out of focus)
  const blurElement =

    // Ref and self are React Ref objects that can either represent an HTML <input> element or null, and since there's no return statement the function returns undefined
    (ref: React.RefObject<HTMLInputElement | null>, self: React.RefObject<HTMLInputElement | null>): undefined => {

      // If the element associated with ref exists
      if (ref.current) ref.current.style.border = "none"; // Remove the border from the element that was NOT the originally focused element

      // If the originally focused element exists
      if (self.current) self.current.blur(); // Blur the originally focused element

    };

  const footerStyle: string = "bg-[#151b23] position-relative bottom-0 text-gray-500";
  const linkStyle: string = "";

  // Return HTML content
  return (
    <>
      <header className="m-10">
        <h1 className={titleStyle}>GitHub Repository Fetch</h1>
        <p className={descStyle}>Input a user's name, and get all their GitHub repositories!</p>
      </header>

      <main>

        {/* Form that calls fetchRepositories with the username passed to it when the form is submitted */}
        <form className={formStyle} onSubmit={e => { e.preventDefault(); fetchRepositories(user) }}>

          {/* Input that changes the value of the user useState hook to the value of itself whenever the user types */}
          <input
            type="text"
            placeholder="GitHub username..."
            className={userInputStyle}
            ref={userInput} // Assign the userInput ref to the <input> element
            onFocus={() => highlightElement(submitButton, userInput)} // When the input element is clicked on, focus on the submit button and selected input
            onBlur={() => blurElement(submitButton, userInput)} // When the input element goes out of focus, blur both the submit button and selected input
            onChange={e => setUser(e.target.value)} // e.target refers to the element that caused the event (the input element) and .value is the value property of that input which contains the text passed by the user. This text is then passed as the state of user using the setUser function, which updates the state of the user variable.
          />

          {/* Input that triggers the form submission event */}
          <input
            type="submit"
            value="Submit"
            ref={submitButton} // Assign the submitButton ref to the <input element>
            className={submitStyle}
          />
        </form>

        <RepoList />
      </main>

      <footer className={footerStyle}>
        <a href="https://github.com/arymus/repo-fetch" className={linkStyle}>Source Code</a>
        <a href="https://github.com/arymus" className={linkStyle}>GitHub Page</a>
      </footer>
    </>
  );
};

export default App // Export the App component to be used in main.tsx