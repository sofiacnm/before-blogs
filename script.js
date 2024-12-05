// Modal Functionality
const modal = document.getElementById('modal');
const modalContent = document.querySelector('.modal-content');
const openModalButton = document.getElementById('open-modal');
const postCommentButton = document.getElementById('post-comment');
const responseInput = document.getElementById('response-input');
const commentsList = document.getElementById('comments-list');
const printButton = document.getElementById('print-button');

// Function to add a comment to the DOM
function addCommentToDOM(comment, prepend = false) {
  const newComment = document.createElement('li');
  newComment.innerHTML = `
    <strong>Dear Reader,</strong><br><br>${comment.text}
    <br><small>${comment.time}</small>
    <hr style="border: 1px solid #000;">
  `;
  if (prepend) {
    commentsList.prepend(newComment); // Add to the top of the list
  } else {
    commentsList.appendChild(newComment); // Add to the bottom of the list
  }
}

// Load comments from Local Storage when the page loads
window.addEventListener('load', () => {
  const savedComments = JSON.parse(localStorage.getItem('comments')) || [];
  savedComments.forEach(comment => {
    addCommentToDOM(comment);
  });
});

// Open modal when "TYPE" button is clicked
openModalButton.addEventListener('click', () => {
  modal.style.display = 'flex'; // Show the modal
});

// Close modal when clicking outside the modal content
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none'; // Hide the modal
  }
});

// Prevent closing modal when clicking inside the modal content
modalContent.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Post a comment and save it to Local Storage
postCommentButton.addEventListener('click', () => {
  const commentText = responseInput.value.trim();
  if (commentText) {
    const currentTime = new Date().toLocaleString();
    const comment = {
      text: commentText,
      time: currentTime
    };

    // Add comment to the DOM
    addCommentToDOM(comment, true); // Prepend the comment to the top

    // Save comment to Local Storage
    const savedComments = JSON.parse(localStorage.getItem('comments')) || [];
    savedComments.unshift(comment); // Add new comment to the beginning
    localStorage.setItem('comments', JSON.stringify(savedComments));

    // Clear the input and close the modal
    responseInput.value = '';
    modal.style.display = 'none';
  } else {
    alert('Please write a comment before posting!');
  }
});

// Print functionality
printButton.addEventListener('click', () => {
  const lastComment = commentsList.firstElementChild; // Get the most recent comment

  if (lastComment) {
    const printWindow = window.open('', '_blank', 'width=600,height=800');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Print Preview</title>
        <style>
          body {
            font-family: 'Georgia', serif; /* Use Georgia font for text */
            margin: 0;
            padding: 20px;
            background-image: url('images/paper-background.svg'); /* Updated Background Image */
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            color: #000; /* Black text for contrast */
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: left;
            height: 100vh; /* Full height */
          }
          .comment-preview {
            text-align: center; /* Center-align text */
            font-size: 1.2rem; /* Slightly larger font for visibility */
            line-height: 1.5; /* Improve readability */
            margin: 0 10%; /* Add some horizontal padding */
            background: none; /* Remove white background */
          }
          .top-right-image {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 60px; /* Adjust size as needed */
          }
          .bottom-left-image {
            position: absolute;
            bottom: 20px;
            left: 20px;
            width: 60px; /* Adjust size as needed */
          }
        </style>
      </head>
      <body>
        <!-- Add the new images -->
        <img src="images/glasses.svg" alt="Glasses Icon" class="top-right-image">
        <img src="images/happy-face.svg" alt="Happy Face Icon" class="bottom-left-image">
        <div class="comment-preview">
          <strong>Dear Reader,</strong><br><br>${lastComment.textContent.split('Dear Reader,')[1].trim()}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close(); // Close the document to trigger rendering
    printWindow.print(); // Trigger the print dialog
  } else {
    alert('No comments available to print.');
  }
});
