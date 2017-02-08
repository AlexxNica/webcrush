/*
Decompressor derived from LZ-String, with unused code removed.
Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
Licensed under the WTFPL license.
*/
(function(input) {
  var f = String.fromCharCode,
      doc = document,
      /*length = input.length, */
      resetValue = 32,
      keyStrBase64 =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      baseReverseDic = {},

  // Original decompress starts here.
	    dictionary = [],
			next,
			enlargeIn = 4,
			dictSize = 4,
			numBits = 3,
			entry = "",
			result = [],
      mpow = Math.pow,
			i,
			w,
			bits, resb, maxpower, power,
			c,
			data = {v:getNextValue(0), p:resetValue, i:1};

  for (i = 0; i < keyStrBase64.length ; i++) {
    baseReverseDic[keyStrBase64.charAt(i)] = i;
  }
  function getNextValue(i) { return baseReverseDic[input.charAt(i)]; }

  // doc.scripts[doc.scripts.length - 1].remove();


	for (i = 0; i < 3; i += 1) {
		dictionary[i] = i;
	}

	bits = 0;
	maxpower = mpow(2,2);
	power=1;
	while (power!=maxpower) {
		resb = data.v & data.p;
		data.p >>= 1;
		if (data.p == 0) {
			data.p = resetValue;
			data.v = getNextValue(data.i++);
		}
		bits |= (resb>0 ? 1 : 0) * power;
		power <<= 1;
	}

	switch (next = bits) {
		case 0:
				bits = 0;
				maxpower = mpow(2,8);
				power=1;
				while (power!=maxpower) {
					resb = data.v & data.p;
					data.p >>= 1;
					if (data.p == 0) {
						data.p = resetValue;
						data.v = getNextValue(data.i++);
					}
					bits |= (resb>0 ? 1 : 0) * power;
					power <<= 1;
				}
			c = f(bits);
			break;
		case 1:
				bits = 0;
				maxpower = mpow(2,16);
				power=1;
				while (power!=maxpower) {
					resb = data.v & data.p;
					data.p >>= 1;
					if (data.p == 0) {
						data.p = resetValue;
						data.v = getNextValue(data.i++);
					}
					bits |= (resb>0 ? 1 : 0) * power;
					power <<= 1;
				}
			c = f(bits);
			break;
    /* Should not happen
		case 2:
			return "";
    */
	}
	dictionary[3] = c;
	w = c;
	result.push(c);
	while (true) {
    /* Should not happen
		if (data.i > length) {
			return "";
		}
    */

		bits = 0;
		maxpower = mpow(2,numBits);
		power=1;
		while (power!=maxpower) {
			resb = data.v & data.p;
			data.p >>= 1;
			if (data.p == 0) {
				data.p = resetValue;
				data.v = getNextValue(data.i++);
			}
			bits |= (resb>0 ? 1 : 0) * power;
			power <<= 1;
		}

		switch (c = bits) {
			case 0:
				bits = 0;
				maxpower = mpow(2,8);
				power=1;
				while (power!=maxpower) {
					resb = data.v & data.p;
					data.p >>= 1;
					if (data.p == 0) {
						data.p = resetValue;
						data.v = getNextValue(data.i++);
					}
					bits |= (resb>0 ? 1 : 0) * power;
					power <<= 1;
				}

				dictionary[dictSize++] = f(bits);
				c = dictSize-1;
				enlargeIn--;
				break;
			case 1:
				bits = 0;
				maxpower = mpow(2,16);
				power=1;
				while (power!=maxpower) {
					resb = data.v & data.p;
					data.p >>= 1;
					if (data.p == 0) {
						data.p = resetValue;
						data.v = getNextValue(data.i++);
					}
					bits |= (resb>0 ? 1 : 0) * power;
					power <<= 1;
				}
				dictionary[dictSize++] = f(bits);
				c = dictSize-1;
				enlargeIn--;
				break;
			case 2:
        /* when done, generate a document with the result. */
				doc.write(result.join(''));
        return;
		}

		if (enlargeIn == 0) {
			enlargeIn = mpow(2, numBits);
			numBits++;
		}

		if (dictionary[c]) {
			entry = dictionary[c];
		} else {
			if (c === dictSize) {
				entry = w + w.charAt(0);
			} /* Should not happen else {
       
				return null;
			} */
		}
		result.push(entry);

		// Add w+entry[0] to the dictionary.
		dictionary[dictSize++] = w + entry.charAt(0);
		enlargeIn--;

		w = entry;

		if (enlargeIn == 0) {
			enlargeIn = mpow(2, numBits);
			numBits++;
		}

	}

})('');
