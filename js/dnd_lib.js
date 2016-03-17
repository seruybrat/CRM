var dragSrcEl = null; //Элемент который будем перетаскивать 
function handleDragStart(e) {
 // this.style.opacity = '0.4';  // this / e.target is the source node.
  dragSrcEl = this;
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over');  // this / e.target is previous target element.
}

function handleDrop(e) {
  // this / e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }

  var html = e.currentTarget.innerHTML;
  e.currentTarget.innerHTML = dragSrcEl.innerHTML;
  dragSrcEl.innerHTML = html
  //console.log(e.currentTarget.innerHTML);
  //console.log(dragSrcEl.innerHTML)
  // See the section on the DataTransfer object.

  return false;
}

function handleDragEnd(e) {
  // this/e.target is the source node.

  [].forEach.call(cols, function (col) {
    col.classList.remove('over');
  });

}


var cols = document.querySelectorAll('[draggable]');
[].forEach.call(cols, function(col) {


    col.addEventListener('drop', handleDrop, false);
    col.addEventListener('dragstart', handleDragStart, false);
 
  col.addEventListener('dragenter', handleDragEnter, false);
  col.addEventListener('dragover', handleDragOver, false);
  col.addEventListener('dragleave', handleDragLeave, false);
  
});