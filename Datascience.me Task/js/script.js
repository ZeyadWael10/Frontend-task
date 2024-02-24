let apiData = [];
let apiMetaData = {};

// Step 1: Fetch data from the API
const apiUrl = 'https://rickandmortyapi.com/api/character/?page=1'; // API endpoint
fetchData(apiUrl);

function fetchData(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // Log the fetched data to the console for now
      apiData = data.results;
      apiMetaData = data.info;
      console.log(apiData, apiMetaData);
      displayDataTable(apiData); // Call function to display data in table
      updatePaginationButtons(apiMetaData);
      addSearchFunctionality(apiData);
      addSortingFunctionality(apiData);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

// Function to display data in the table
function displayDataTable(characters) {
  const tableBody = document.getElementById('character-table-body');
  tableBody.innerHTML = ''; // Clear table body before displaying new data
  characters.forEach(character => {
    tableBody.innerHTML += `
      <tr>
        <td>${character.name}</td>
        <td><img src="${character.image}" alt="${character.name}" style="width: 50px;"></td>
      </tr>
    `;
  });
}

// Function to update pagination buttons
function updatePaginationButtons(metaData) {
  const nextButton = document.getElementById('next-page');
  const prevButton = document.getElementById('prev-page');
  
  nextButton.addEventListener('click', () => {
    if (metaData.next) {
      fetchData(metaData.next); // Fetch data for the next page
    } else {
      nextButton.disabled = !metaData.next; // Disable next button if there's no next page   
    }
  });
  
  prevButton.addEventListener('click', () => {
    if (metaData.prev) {
      fetchData(metaData.prev); // Fetch data for the previous page
    } else {
      prevButton.disabled = !metaData.prev; // Disable previous button if there's no previous page
    }
  });
}

// Function to handle search
function addSearchFunctionality(data) {
  document.getElementById('search-input').addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredCharacters = data.filter(character => character.name.toLowerCase().includes(searchTerm));
    displayDataTable(filteredCharacters);
  });
}

// Function to handle sorting
function addSortingFunctionality(data) {
  const tableHeaders = document.querySelectorAll('#character-table thead th');
  tableHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const column = header.dataset.column;
      const order = header.dataset.order;
      const sortedData = sortData(data, column, order);
      displayDataTable(sortedData);
      header.dataset.order = order === 'asc' ? 'desc' : 'asc'; // Toggle sorting order
    });
  });
}

// Function to sort data
function sortData(data, column, order) {
  return data.sort((a, b) => {
    if (order === 'asc') {
      return a[column] > b[column] ? 1 : -1;
    } else {
      return a[column] < b[column] ? 1 : -1;
    }
  });
}
