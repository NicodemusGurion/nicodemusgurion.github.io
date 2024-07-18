---
layout: none
---
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Comparison</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }
        .container {
            width: 100%;
            overflow: hidden;
            position: relative;
        }
        .scrollable {
            overflow: auto;
            width: 100%;
        }
        .table-container {
            display: inline-block;
            min-width: 100%;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
            white-space: pre-wrap; /* Allows text to wrap inside the cell */
            max-width: 80ch; /* Max width of 80 characters */
            box-sizing: border-box;
        }
        th {
            position: sticky;
            top: 0;
            background: #f8f8f8;
            z-index: 10;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="scrollable">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Source 1</th>
                            <th>Source 2</th>
                            <th>Source 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Source 1.</td>
                            <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Source 2.</td>
                            <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Source 3.</td>
                        </tr>
                        <tr>
                            <td>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Source 1.</td>
                            <td>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Source 2.</td>
                            <td>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Source 3.</td>
                        </tr>
                        <!-- More rows can be added here -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
