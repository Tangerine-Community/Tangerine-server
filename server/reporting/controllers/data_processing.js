/**
 * This file creates header for CSV and processes the form response.
 *
 *  Modules: generateHeaders, processFormResponse.
 */


/** This function generates headers for csv.
 *
 * @param {object} formData - form response from database
 *
 * @returns {array} generated headers for csv
 */

const generateHeaders = function (formData) {
  let formResponseHeaders = [];

  formData.items.forEach(data => {

    data.inputs.forEach(item => {
      // create headers for all values that are strings
      if (typeof (item && item.value) === 'string') {
        formResponseHeaders.push({
          header: `${data.title}_${item.name}`,
          key: `${formData.form.id}.${data.title}.${item.name}`
        });
      }
      // create headers for all values that are arrays
      if (Array.isArray(item.value)) {
        item.value.forEach(group => {
          formResponseHeaders.push({
            header: `${data.title}_${item.name}_${group.name}`,
            key: `${formData.form.id}.${data.title}.${item.name}.${group.name}`
          });
        });
      }
      // create headers for all values that are pure objects
      if (typeof (item && item.value) === 'object' && !Array.isArray(item) && item !== null) {
        let elementKeys = Object.keys(item.value);
        elementKeys.forEach(key => {
          formResponseHeaders.push({
            headers: `${data.title}_${item.name}_${key}`,
            key: `${formData.form.id}.${data.title}.${item.name}.${key}`
          });
        })
      }

    });

  });

  return formResponseHeaders;
}


/** This function processes form responses for csv.
 *
 * @param {object} formData - form response from database
 *
 * @returns {object} processed results for csv
 */

const processFormResponse = function(formData) {
  let formResponseResult = {};

  formData.items.forEach(data => {
    data.inputs.forEach(item => {
      // create headers for all values that are strings
      if (typeof (item && item.value) === 'string') {
        formResponseResult[`${formData.form.id}.${data.title}.${item.name}`] = item.value;
      }
      // create headers for all values that are arrays
      if (Array.isArray(item.value)) {
        item.value.forEach(group => {
          formResponseResult[`${formData.form.id}.${data.title}.${item.name}.${group.name}`] = group.value;
        });
      }
      // create headers for all values that are pure objects
      if (typeof (item && item.value) === 'object' &&!Array.isArray(item) && item !== null) {
        let elementKeys = Object.keys(item.value);
        elementKeys.forEach(key => {
          formResponseResult[`${formData.form.id}.${data.title}.${item.name}.${key}`] = item.value[key];
        });
      }

    });

  });

  return formResponseResult;
};


exports.generateHeaders = generateHeaders;

exports.processFormResponse = processFormResponse;
