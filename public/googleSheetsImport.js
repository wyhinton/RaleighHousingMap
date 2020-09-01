function generateObjectFromSpreadData(url, linesToSkipInt) {
  // const response = await fetch('')
  let myCellContentArr = []
  let finalProjObs = []
  let starts = []
  let rowStartEndArrays = []
  let testProjArray = []

  return $.getJSON(url).then(function(data) {

    let cells = data.feed.entry;
    let numRows = parseInt(data.feed.gs$rowCount.$t)-1
    let numCols = parseInt(data.feed.gs$colCount.$t)
    let totalNumCels = numRows * numCols;

    let rowRanges = returnRowCellIndexRanges(numRows, numCols, linesToSkipInt)
    myCellContentArr = returnArrayOfRowContents(cells, rowRanges)
    let finalProjObs = mapHeaderRowToObjectProperties(2, myCellContentArr, cells)

    return finalProjObs
  })
}

function returnRowCellIndexRanges(numRows, numCols, rowsToSkip){
  let starts = []
  let rowRange = []
  for (var i = 0; i < numRows; i++) {
    let range = (numCols * i)+1;
    starts.push(range)
  }
  for (var i = 1; i < starts.length; i++) {
    let curStart = starts[i]
    let curRange = []
    curRange[0] = curStart
    curRange[1] = curStart + numCols
    rowRange.push(curRange)
  }

  return rowRange;
}

function returnArrayOfRowContents(dataCells, rowRangeArray){
  let arrayOfRows = []
  for (var i = 0; i < rowRangeArray.length; i++) {
    let curRange = rowRangeArray[i]
    let projArray = dataCells.slice(curRange[0], curRange[1])
    let rowContentArray = []
    for (var j = 0; j < projArray.length; j++) {
      let curCell = projArray[j]
      let curContent = curCell.content.$t;
      rowContentArray.push(curContent)
    }
    arrayOfRows.push(rowContentArray)
  }
  return arrayOfRows
}

function mapHeaderRowToObjectProperties(headerRowIndex, rowsContentArray, cells){
  let rowObjects = []
  let headerCells = cells.filter(obj => {
    return obj.gs$cell.row === headerRowIndex.toString()
  })
  let headerNames = headerCells.map(a => a.content.$t)

  for (var i = 1; i < rowsContentArray.length; i++) {
    let curContentArray = rowsContentArray[i]
    let contentObjHolder = {}
    for (var j = 0; j < headerNames.length; j++) {
      let curPropToAdd = headerNames[j]
      contentObjHolder[curPropToAdd] = curContentArray[j]

    }
    rowObjects.push(contentObjHolder)
  }

  return rowObjects
}
