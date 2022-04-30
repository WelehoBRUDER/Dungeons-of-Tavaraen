function sortInventory(category: string, reverse: boolean, inventory: Array<any>, context: string) {
  sortingReverse = !sortingReverse;
  if (category == "name" || category == "type") {
    inventory.sort((a, b) => stringSort(a, b, category, reverse));
  }
  else if (category == "grade") {
    inventory.sort((a, b) => gradeSort(a, b, reverse));
  }
  else if (category == "worth") {
    inventory.sort((a, b) => worthSort(a, b, reverse));
  }
  else inventory.sort((a, b) => numberSort(a, b, category, reverse));
  inventory.map((item, index: number) => {
    return item.index = index;
  });
  if (context.includes("SELLING")) createMerchantWindow(false, true);
  else if (context == "UPGRADE") createSmithingWindow(false);
  else renderInventory();
}

function stringSort(a: any, b: any, string: string, reverse: boolean = false) {
  var nameA = a[string].toUpperCase(); // ignore upper and lowercase
  var nameB = b[string].toUpperCase(); // ignore upper and lowercase
  if (reverse) {
    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  }
  else {
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  }
};

function modsSort(a: any, b: any) {
  const numA: number = a[1];
  const numB: number = b[1];
  if (numA > numB) {
    return -1;
  }
  if (numA < numB) {
    return 1;
  }
  return 0;
}

function gradeSort(a: any, b: any, reverse: boolean = false) {
  var numA: number = parseInt(a.gradeValue);
  var numB: number = parseInt(b.gradeValue);
  if (!reverse) {
    if (numA > numB) {
      return -1;
    }
    if (numA < numB) {
      return 1;
    }

    // names must be equal
    return 0;
  }
  else {
    if (numA < numB) {
      return -1;
    }
    if (numA > numB) {
      return 1;
    }

    // names must be equal
    return 0;
  }
}

function numberSort(a: any, b: any, string: string, reverse: boolean = false) {
  var numA = a[string];
  var numB = b[string];
  if (!reverse) {
    if (numA > numB) {
      return -1;
    }
    if (numA < numB) {
      return 1;
    }

    // names must be equal
    return 0;
  }
  else {
    if (numA < numB) {
      return -1;
    }
    if (numA > numB) {
      return 1;
    }

    // names must be equal
    return 0;
  }
}

function worthSort(a: any, b: any, reverse: boolean = false) {
  if (typeof a.fullPrice !== "function") return 1;
  else if (typeof b.fullPrice !== "function") return -1;
  var numA = a.fullPrice();
  var numB = b.fullPrice();
  if (!reverse) {
    if (numA > numB) {
      return -1;
    }
    if (numA < numB) {
      return 1;
    }

    // names must be equal
    return 0;
  }
  else {
    if (numA < numB) {
      return -1;
    }
    if (numA > numB) {
      return 1;
    }

    // names must be equal
    return 0;
  }
}