let obj = {
    title: "Article Title",
    summary: "These are some words about this article, its news and stuff. these are some words about this article, its news and stuff. these are some words about this article, its news and stuff. "
}

$(document).ready(function () {
    $('.collapsible').collapsible();
    $.ajax({
        method: "GET",
        url: "/all"
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            for (var i in data) {
                makeArticleRow(data[i])                
            }
            $('.collapsible').collapsible();
        });

});

function makeArticleRow(obj){
    let li = $('<li>', {id: obj._id});
    let divHeader = $('<div>', { class: "collapsible-header" }).text(obj.title).appendTo(li);
    let divBody = $('<div>', { class: "collapsible-body", id: obj._id }).appendTo(li);
    let pSum = $('<p>').text(obj.summary).appendTo(divBody);
    let commentBox = $('<ul>', { class: "collapsible popout" }).appendTo(divBody);
    let liTwo = $('<li>').appendTo(commentBox);
    let commentHeader = $('<div>', { class: "collapsible-header" }).text('Comments').appendTo(liTwo);
    let commentBody = $('<div>', { class: "collapsible-body" }).appendTo(liTwo);
    //CHANGE COMMENT HERE
    if (obj.comments.length > 0){
        for (var i in obj.comments){
            let comment = populateComments(obj.comments[i]);
            comment.appendTo(commentBody)
        }
    } else{
        let pCom = $('<p>').text("No Comments Yet").appendTo(commentBody);
    }
    //MAKE COMMENT TEXT BOX AND SUBMIT BTN
        
    $('<div>', {class:'divider'}).appendTo(divBody);
    let linkbtn = $('<a>', {
        id: obj._id,
        href: obj.link,
        class: 'waves-effect waves-teal btn-flat right'
    }).text('Link').appendTo(divBody)
    $('<br>').appendTo(divBody)
    li.appendTo('.article-list');
}

function populateComments(){
    let comment = $('<ul>');
    // MAKE COMMENT WITH USERNAME AND IMAGE
    return comment;
}

// ON CLICK FOR ADD COMMENT
// AJAX FOR ADDING COMMENT