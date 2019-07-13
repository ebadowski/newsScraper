let obj = {
    title: "Article Title",
    summary: "These are some words about this article, its news and stuff. these are some words about this article, its news and stuff. these are some words about this article, its news and stuff. "
}
let li = $('<li>').appendTo('.collapsible');
let divHeader = $('<div>', {class:"collapsible-header"}).text(obj.title).appendTo(li);
let divBody = $('<div>', {class:"collapsible-body"}).appendTo(li);
let pSum = $('<p>').text(obj.summary).appendTo(divBody);
let commentBox= $('<ul>',{class:"collapsible popout"}).appendTo(divBody);
let liTwo = $('<li>').appendTo(commentBox);
let commentHeader = $('<div>', {class:"collapsible-header"}).text('Comments').appendTo(liTwo);
let commentBody = $('<div>', {class:"collapsible-body"}).appendTo(liTwo);
// for loop to insert each comment with user name and photo
    // https://materializecss.com/collections.html#circle
// text field and button to add comment
//link to article