var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var x = {
    "x[]": "asdfX",
    "v.x[]": "asdfV",
    "v.m.l": "asdf-val"
};
var obj1 = {
    a: {
        b: [
            { _id: '5dc0ad700000000000000000', name: 'asdf1' },
            { _id: '5dc0ad700000000000000001', name: 'asdf2' },
            { _id: '5dc0ad700000000000000002', name: 'asdf3' }
        ]
    },
    value: 'hui'
};
var obj2 = {
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
var obj3 = {
    a: {
        b: [
            { _id: '5dc0ad700000000000000000', name: 'asdf1' },
            { _id: '5dc0ad700000000000000001', name: 'asdf2' },
            { _id: '5dc0ad700000000000000002', name: 'asdf3' },
        ]
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
function editObject(x, inputObject) {
    var obj = inputObject;
    // all x keys because there might be more than one
    var keys = Object.keys(x);
    var _loop_1 = function (i) {
        // value of respective key in x, we also don't want the value in JSON format
        var value = x[keys[i]];
        var key = keys[i];
        // is a.b
        if (/^(a\.b.)/.test(key)) {
            // and empty array, so there will be new object added specified by argument's 
            // value
            if (/(\[\])$/.test(key)) {
                obj.a.b.push(value);
            }
            // is specified id but not added key
            if (/(\[.+\])$/.test(key)) {
                // specify the id part in square brackets
                var id_1 = key.slice(4, -1);
                // check if the id exist
                if (obj.a.b.find(function (e) { return e._id === id_1; })) {
                    if (value === null) {
                        var filter = obj.a.b.filter(function (e) { return e._id !== id_1; });
                        obj.a.b = filter;
                    }
                    else if (value.title) {
                        // updating the name into title
                        var update = obj.a.b.filter(function (e) { return e._id === id_1; });
                        update[0].title = value.title;
                        delete update[0].name;
                        // delete the original object
                        var filter = obj.a.b.filter(function (e) { return e._id !== id_1; });
                        obj.a.b = filter;
                        // pushing the updated object
                        obj.a.b.push(update[0]);
                    }
                }
            }
            // there is id specified and also the key and vallue that should be added into
            // this object
            if (/(\[.+\])\..+$/.test(key)) {
                // analysing the key to substruct ID and newKey value for update
                var keyElements = key.split('.');
                var newKey = keyElements[2];
                var id_2 = keyElements[1].slice(2, -1);
                // again testing if the id actually exists
                if (obj.a.b.find(function (e) { return e._id === id_2; })) {
                    // getting the object to update and updating it with the value
                    var update = obj.a.b.filter(function (e) { return e._id === id_2; });
                    update[0][newKey] = value;
                    // deleting the original object from an array
                    var filter = obj.a.b.filter(function (e) { return e._id !== id_2; });
                    obj.a.b = filter;
                    // pushing the updated object
                    obj.a.b.push(update[0]);
                }
            }
        }
        else {
            // if there is no a.b at the beginning 
            // function for following operations
            // working with path in a string format and adding/updating on chosen path
            // of the object
            var setObjectProperty = function (object, path, value) {
                var _a;
                var parts = path.split('.');
                var limit = parts.length - 1;
                for (var i_1 = 0; i_1 < limit; ++i_1) {
                    var key_1 = parts[i_1];
                    object = (_a = object[key_1]) !== null && _a !== void 0 ? _a : (object[key_1] = {});
                }
                var key = parts[limit];
                object[key] = value;
            };
            var deleteObjectProperty = function (object, path) {
                var _a;
                var parts = path.split('.');
                var toDelete;
                // in case we are on root
                if (parts.length === 1) {
                    delete object[parts[0]];
                    return object;
                }
                var limit = parts.length - 1;
                for (var i_2 = 0; i_2 < limit; ++i_2) {
                    var key_2 = parts[i_2];
                    toDelete = (_a = object[key_2]) !== null && _a !== void 0 ? _a : (object[key_2] = {});
                }
                var key = parts[limit];
                delete toDelete[key];
                return object;
            };
            // there is empty array in the end meaning we will add a new object under certain path 
            // specified by the key
            if (/(\[\])$/.test(key)) {
                // setting the array that will be passed into the function
                var array = [];
                array = __spreadArray(__spreadArray([], array, true), [value], false);
                setObjectProperty(obj, key.slice(0, -2), array);
            }
            // there is only path specified by key
            else {
                // if the value is null we will delete specified key
                if (value === null) {
                    obj = deleteObjectProperty(obj, key);
                }
                else {
                    setObjectProperty(obj, key, value);
                }
            }
        }
    };
    // so I can parse through them
    for (var i = 0; i < keys.length; i++) {
        _loop_1(i);
    }
    console.log(obj);
    return obj;
}
;
// caling the function
editObject(x, obj3);
