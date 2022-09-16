// update value
type updateParam = {[key: string]: any} 
const x: updateParam =  {
	"x[]": "asdfX",
	"v.x[]": "asdfV",
	"v.m.l": "asdf-val"
};

// select one of the input objects and pass it as a param into the 
//function at the end of this file to test the functionality

type inputObject = {a: {b: {_id: string, title?: string, name?: string, [key: string]: any}[], c?: string, [key: string]: any}, value: string,
  	images?: {
		thumbnail?: string,
		small?: string,
		medium?: string,
		large?: string,
		xlarge?: string
	},
  [key: string]: any}

let obj1: inputObject = {
	a: {
		b: [
			{ _id: '5dc0ad700000000000000000', name: 'asdf1' },
			{ _id: '5dc0ad700000000000000001', name: 'asdf2' },
			{ _id: '5dc0ad700000000000000002', name: 'asdf3' }
		]
	},
	value: 'hui'
};
  
let obj2: inputObject = {
	a: {
		b: [
			{ _id: '5dc0ad700000000000000000', name: 'asdf1' },
			{ _id: '5dc0ad700000000000000001', name: 'asdf2' },
			{ _id: '5dc0ad700000000000000002', name: 'asdf3' }
		],
		c: 'hallo'
	},
	value: 'hui'
};
  
let obj3: inputObject = {
  a: {
    b: [
      { _id: '5dc0ad700000000000000000', name: 'asdf1' },
      { _id: '5dc0ad700000000000000001', name: 'asdf2' },
      { _id: '5dc0ad700000000000000002', name: 'asdf3' },
    ],
  },
  value: 'hui',
  	images: {
		thumbnail: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
		small: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
		medium: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
		large: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
		xlarge: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg'
	}
};

// the function for updating object with two arguments x (update)
// and object to be updated


function editObject(x: updateParam, inputObject: inputObject): Object {
let obj: inputObject = inputObject; 
// all x keys because there might be more than one
const keys: string[] = Object.keys(x);
// so I can parse through them
for(let i: number = 0; i < keys.length; i++) {
// value of respective key in x, we also don't want the value in JSON format
const value = x[keys[i]];
const key = keys[i]
 // is a.b
    if(/^(a\.b.)/.test(key)) {
      // and empty array, so there will be new object added specified by argument's 
      // value
      if(/(\[\])$/.test(key)) {
        obj.a.b.push(value);
      }
      // is specified id but not added key
      if(/(\[.+\])$/.test(key)) {
        // specify the id part in square brackets
        let id = key.slice(4,-1);
        // check if the id exist
        if(obj.a.b.find((e) => e._id ===id)) {
            if (value === null) {
              const filter = obj.a.b.filter((e) => e._id !== id);
              obj.a.b = filter;
            } else if (value.title) {
              // updating the name into title
              const update = obj.a.b.filter((e) => e._id === id);
              update[0].title = value.title;
              delete update[0].name;
              // delete the original object
              const filter = obj.a.b.filter((e) => e._id !== id);
              obj.a.b = filter;
              // pushing the updated object
              obj.a.b.push(update[0]);
            }  
        }
      }
    // there is id specified and also the key and vallue that should be added into
    // this object
    if(/(\[.+\])\..+$/.test(key)) {
      // analysing the key to substruct ID and newKey value for update
      const keyElements: string[] = key.split('.')
      const newKey = keyElements[2];
      let id = keyElements[1].slice(2,-1);
        // again testing if the id actually exists
           if(obj.a.b.find((e) => e._id ===id)) {
      // getting the object to update and updating it with the value
      const update = obj.a.b.filter((e) => e._id === id);
      update[0][newKey] = value;
      // deleting the original object from an array
      const filter = obj.a.b.filter((e) => e._id !== id);
      obj.a.b = filter;
      // pushing the updated object
      obj.a.b.push(update[0]);
    }
    }

  } else {
  // if there is no a.b at the beginning 

  // function for following operations
  // working with path in a string format and adding/updating on chosen path
  // of the object
  
  const setObjectProperty = (object: inputObject, path:string, value: string | string[]) => {
  	const parts: string[] = path.split('.');
  	const limit: number = parts.length - 1;
	for (let i: number = 0; i < limit; ++i) {
      	const key = parts[i];
    	object = object[key] ?? (object[key] = { });
    }
  	const key = parts[limit];
    object[key] = value;
};

  const deleteObjectProperty = (object: inputObject, path: string) => {
  	const parts: any[] = path.split('.');
    let toDelete
    // in case we are on root
    if (parts.length === 1) {
      delete object[parts[0]];
      return object;
    }
  	const limit = parts.length - 1;
	for (let i = 0; i < limit; ++i) {
      const key = parts[i];
    	toDelete = object[key] ?? (object[key] = { });
    }
  	const key = parts[limit];
    delete toDelete[key];
    return object
};
   
      
  // there is empty array in the end meaning we will add a new object under certain path 
  // specified by the key
  if (/(\[\])$/.test(key)) {

  // setting the array that will be passed into the function
        let array: string[] = [];
        array = [...array, value];
    setObjectProperty(obj, key.slice(0, -2), array);
  }

  // there is only path specified by key
  else {
    // if the value is null we will delete specified key
   if(value === null){
      obj = deleteObjectProperty(obj, key)

   } else {

    setObjectProperty(obj, key, value);
   }
      }
    }
  }
console.log(obj);
return obj;
};

editObject(x, obj3);