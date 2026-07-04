# Internship Program of Web Development with HTML & CSS & JavaScript by ApexPlanet Software Pvt. Ltd.

Task 3 :-
API Integration and Functional Mini Applications added to the existing 6-page website from Task 2.

## Pages

- `index.html` – Home
- `about.html` – About
- `services.html` – Services
- `contact.html` – Contact
- `weather.html` – Weather App *(new)*
- `todo.html` – Todo List *(new)*

## Folder Structure

```
Task 3/
├── index.html
├── about.html
├── services.html
├── contact.html
├── weather.html
├── todo.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── script.js
│   ├── weather.js
│   └── todo.js
└── images/
    └── logo.png
        other images
```

## New Pages Added

### Weather App — `weather.html` / `js/weather.js`

- **Search by city name** — type a city and press Search or hit Enter.
- **Live weather data** — fetches from the OpenWeatherMap API using Async/Await and the Fetch API.
- **Displays** — city name, country, current temperature (°C), weather description, humidity, wind speed, and a weather icon.
- **Loading indicator** — spinner shown while the API request is in progress.
- **Error handling** — friendly message for invalid city names and a separate message for network failures.
- **LocalStorage persistence** — saves the last searched city and auto-loads it on next visit.

### Todo List App — `todo.html` / `js/todo.js`

- **Add tasks** — via button click or Enter key; empty tasks are blocked with a validation message.
- **Edit tasks** — inline editing with a save button or Enter to confirm, Escape to cancel.
- **Delete tasks** — removes a task permanently.
- **Toggle complete / incomplete** — mark tasks done or undone with a single click.
- **Filters** — switch between All Tasks, Active, and Completed views.
- **Clear Completed** — removes all completed tasks at once.
- **Task counter** — shows how many tasks remain active.
- **LocalStorage persistence** — all tasks are saved and automatically reloaded after a page refresh.

## Component Placement

| Component | Home | About | Services | Contact | Weather | Todo |
|---|---|---|---|---|---|---|
| Hamburger Menu | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dark / Light Mode | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Back To Top Button | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Image Slider | ✅ | | | | | |
| Modal Popup | ✅ | | ✅ | | | |
| Animated Counters | ✅ | ✅ | | | | |
| Form Validation | | | | ✅ | | |
| Character Counter | | | | ✅ | | |
| Smooth Scrolling | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Weather App | | | | | ✅ | |
| Todo List App | | | | | | ✅ |

## JavaScript Concepts Used — Task 3

- `fetch()` — retrieves live weather data from the OpenWeatherMap API.
- `async` / `await` — handles asynchronous API calls in a readable, synchronous-style flow.
- `Promise` — underlying mechanism behind every `fetch()` and `await` call.
- `response.json()` — parses the raw API response into a usable JavaScript object.
- `try / catch / finally` — catches network errors and API errors, always clears the loading state.
- `localStorage.setItem` / `getItem` — persists the last searched city (Weather) and all tasks (Todo) across sessions.
- `DOMContentLoaded` — auto-loads saved data from LocalStorage when each page first opens.
- `addEventListener` — handles all user interactions: clicks, keydown (Enter / Escape), and input events.
- `createElement` / `appendChild` / `innerHTML` — dynamically builds weather result cards and todo list items.
- `classList.add` / `remove` — toggles `hidden`, `active`, `completed`, and `input-error` states across both apps.
- `Array` methods (`filter`, `find`, `forEach`, `unshift`) — manage the tasks array in the Todo app.
- `JSON.stringify` / `JSON.parse` — serialises and deserialises task objects to and from LocalStorage.
- `encodeURIComponent` — safely encodes city names with spaces or special characters in the API URL.