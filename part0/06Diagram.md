sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server

    activate browser
    Note right of browser: The browser executes the callback function that renders the notes
    deactivate browser


    # a online service "Mermaid Live Editor" is using to render the Mermaid diagram