function createCalendar(id, year, month) {
  let elem = document.getElementById(id);
  let date = new Date(year, month);
  let calendar = document.createElement('table');

  calendar.appendChild(createWeekHeaderRow());
  
  //ñîçäàåì è çàïîëíÿåì îñíîâûå ðÿäû ñ äàòîé
  let row = createWeekRow();
  let countDates = new Date(year, month+1, 0).getDate();
  let dayNumber = date.getDay() || 7;
  for (let dateNumber = 1; dateNumber <= countDates; dateNumber++) {
    row.cells[dayNumber - 1].innerHTML = dateNumber;
    
    if (dayNumber === 7) {
      calendar.appendChild(row);
      row = createWeekRow();
      dayNumber = 0;
    }

    dayNumber++;
  }
  
  calendar.appendChild(row);
  
  elem.appendChild(calendar);
  
  function createWeekHeaderRow() {
    let dayOfWeekTexts = ['ïí', 'âò', 'ñð', '÷ò', 'ïò', 'ñá', 'âñ'];
    let headerRow = document.createElement('tr');
  
    for (let i = 0; i < dayOfWeekTexts.length; i++) {
      let dayOfWeek = document.createElement('th');
      dayOfWeek.innerHTML = dayOfWeekTexts[i];
      headerRow.appendChild(dayOfWeek);
    }
  
    return headerRow;
  }

  function createWeekRow() {
    let row = document.createElement('tr');
  
    for (let i = 1; i <= 7; i++) {
      let cell = document.createElement('td');
      row.appendChild(cell);
    }
  
    return row;
  }
}



let table = document.getElementById('grid');

table.onclick = function(evt) {
  let target = evt.target;

  if (target.nodeName !== 'TH') return;

  let tBody = this.lastElementChild;
  let sortedTBody = [];
  let sortMethods = {
    number(obj1, obj2) {
      return obj1.value - obj2.value;
    },

    string(obj1, obj2) {
      return obj1.value > obj2.value ? 1 : -1;
    }
  };

  for (let i = 0; i < tBody.children.length; i++) {
    let tr = tBody.children[i];
    sortedTBody.push({
      tr,
      value: tr.children[target.cellIndex].innerHTML
    });
  }

  sortedTBody.sort(sortMethods[target.dataset.type]);

  for (let i = 0; i < sortedTBody.length; i++) {
    tBody.appendChild(sortedTBody[i].tr);
  }
};



document.onmouseover = function(evt) {
  let target = evt.target;
  
  if (target.tagName !== "BUTTON") return;
  
  let targetNextElt = target.nextElementSibling;
  
  if (targetNextElt.classList.contains('tooltip')) {
    targetNextElt.hidden = false;
    positionAt(target, targetNextElt);
    return;
  }
  
  let tooltipInner = target.dataset.tooltip;
  
  if (!tooltipInner) return;
  
  let tooltip = document.createElement('span');
  tooltip.className = 'tooltip';
  tooltip.innerHTML = tooltipInner;
  
  target.insertAdjacentElement('afterEnd', tooltip);
  let {offsetHeight: tooltipHeight, offsetWidth: tooltipWidth} = tooltip;
  positionAt(target, tooltip);
  
  function positionAt(target, {offsetHeight: tooltipHeight, offsetWidth: tooltipWidth}) {
    let targetCoords = target.getBoundingClientRect();
    let tooltip = arguments[1];
    
    if (targetCoords.top >= tooltipHeight + 5) {
      tooltip.style.cssText = `
      top: ${targetCoords.top + pageYOffset - (tooltipHeight + 5)}px;
      left: ${Math.max((targetCoords.left - (tooltipWidth - target.offsetWidth) / 2), 0)}px;
      `;
    } else {
      console.log(targetCoords.bottom);
      tooltip.style.cssText = `
      top: ${targetCoords.bottom + 5 + pageYOffset}px;
      left: ${Math.max((targetCoords.left - (tooltipWidth - target.offsetWidth) / 2), 0)}px;
      `;
    }
  }
}

document.onmouseout = function(evt) {
  let target = evt.target;
  
  if (target.tagName !== "BUTTON") return;
  
  let targetNextElt = target.nextElementSibling;
  
  if (targetNextElt.classList.contains('tooltip')) {
    targetNextElt.hidden = true;
  }
}
