{
    $('#preview-image').hide();

    $('input[type="file"]').change(function(event){
        $('#preview-image').hide();

        const file=this.files[0];                   // can use event.target OR this to get the target element
        // console.log(file);
        if(file){
            let reader=new FileReader();
            reader.onload=function(event){               // gets fired when the reader is successfully loaded   
                // console.log(this.result);
                $('#preview-image').attr('src', event.target.result).show();
            };
            reader.readAsDataURL(file);                 // converts the file into data:URL(encoded string) after upload
        }                                               // and stores the data:URL into result attribute of input
    });
}