
export default function upload(form) {
    if(form === undefined){
        throw 'form is not undefined';
    };
    return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        reader.readAsDataURL(form.files[0]);
        reader.onload = function(e){
            resolve(reader);
        };
        reader.onerror = function () {
            reject();
        }
    })
};