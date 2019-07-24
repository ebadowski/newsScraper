
$(document).ready(function () {
    $('.collapsible').collapsible();

    buildTabs();

});

function buildTabs() {
    getTabs(function () {
        //check if la
        let tabID = $('li.tab > a.active').attr('tab_id');
        $('.tabs').tabs();
        getArticles(tabID);
    })
}

function getTabs(callback) {
    $('.tabs-div').empty();
    $.ajax({
        method: "GET",
        url: "/tabs/all"
    })
        .then(function (data) {
            //console.log(data);
            let tabUL = $('<ul>', { class: "tabs" });
            for (var i in data) {
                let newTab = makeTab(data[i], (data.length - 1 == i));
                newTab.appendTo(tabUL)
            }

            //if date of last entry != today
            let today = new Date;
            today = today.toDateString().substring(4);
            if (data[i].date != today) {
                let li = $('<li>', { class: 'scrape-tab tab col s3' });
                let a = $('<a>', { class: "scrape-btn" }).appendTo(li);
                $('<i>', { class: 'material-icons' }).text("add_circle_outline").appendTo(a);
                li.appendTo(tabUL)
            }

            tabUL.appendTo('.tabs-div');
            callback();
        });
}


function makeTab(obj, bool) {
    let li = $('<li>', { class: 'tab col s3' });
    let a = $('<a>', {
        class: "tab-btn",
        tab_id: obj._id
    }).text(obj.date).appendTo(li);

    if (bool) { a.addClass("active") }
    return li;
}

function getArticles(tabID) {
    $('.article-list').empty()
    $.ajax({
        method: "GET",
        url: "/articles/" + tabID
    })
        // With that done
        .then(function (data) {
            articles = data.articles;
            console.log(articles)
            for (var i in articles) {
                makeArticleRow(articles[i]);
                // checks if logged in already, function is in app.js but must wait for this call to end
                checkLoginState();
            }
            $('.collapsible').collapsible();
        });
}

function makeArticleRow(obj) {
    // makes collapsible container and contents
    let li = $('<li>');
    //let li = $('<li>', { id: obj._id });
    let divHeader = $('<div>', { class: "collapsible-header" }).text(obj.title).appendTo(li);
    let divBody = $('<div>', { class: "collapsible-body" }).appendTo(li);
    //let divBody = $('<div>', { class: "collapsible-body", id: obj._id }).appendTo(li);
    let pSum = $('<p>').text(obj.summary).appendTo(divBody);
    let commentBox = $('<ul>', { class: "collapsible popout" }).appendTo(divBody);
    let liTwo = $('<li>').appendTo(commentBox);
    let commentHeader = $('<div>', { class: "collapsible-header comment-header" }).text('Comments').appendTo(liTwo);
    let commentBody = $('<div>', { class: "collapsible-body" }).appendTo(liTwo);
    let commentDiv = $('<div>', { class: "container comment-container", "articleID": obj._id.$oid, style: "max-height: 250px; overflow: scroll;" }).appendTo(commentBody);

    let commentList = $('<ul>', { class: 'collection comment-collection', "articleID": obj._id.$oid }).appendTo(commentDiv);
    if (obj.comments.length > 0) {
          for (var i in obj.comments) {
            let comment = populateComments(obj.comments[i]);
            comment.appendTo(commentList)
        }
    } else {
        let comment = populateComments({
            body: "No Comments Yet",
            user: {}
        });
            comment.addClass("comment-placeholder")
            comment.appendTo(commentList)
    }
    $('<br>').appendTo(commentBody);
    $('<div>', { class: 'divider' }).appendTo(commentBody);

    // make comment text box and submit btn
    let form = $('<form>').appendTo(commentBody);
    //let inputBody = $('<div>', { class: "input-field" }).appendTo(form);
    $('<br>').appendTo(form);
    let row = $('<div>', { class: "row" }).appendTo(form)
    let field = $('<div>', { class: "input-field comment-avatar", style: 'width: 100%' }).appendTo(row);
    $('<textarea>', { id: ("comment_text_" + obj._id.$oid), class: "materialize-textarea right", style: "width: 80%; margin-left:5px;" }).appendTo(field);
    $('<label>', { for: ("comment_text_" + obj._id.$oid), style: "padding-left:25px;" }).text("Comment").appendTo(field);

    $('<a>', {
        "articleID": obj._id.$oid,
        class: 'waves-effect waves-teal btn-flat right submit-comment'
    }).text('Submit').appendTo(form);
    $('<br>').appendTo(form);

    // adds link button
    $('<div>', { class: 'divider' }).appendTo(divBody);
    let linkbtn = $('<a>', {
        id: "link_" + obj._id.$oid,
        href: obj.link,
        class: 'waves-effect waves-teal btn-flat right'
    }).text('Link').appendTo(divBody)
    $('<br>').appendTo(divBody)
    li.appendTo('.article-list');
}

function populateComments(obj) {


    let comment = $('<li>', { class: "collection-item avatar", style: "height:auto" });
    $('<img>', { src: obj.user.imgLink, class: "circle", style: "height:25px; width: 25px;" }).appendTo(comment);
    $('<span>', { class: "title" }).text(obj.user.username).appendTo(comment);
    $('<p>').text(obj.body).appendTo(comment);

    return comment;
}



// VERIFICATION IF LOGGED IN
function changeCommentTextBox(bool) {
    if (bool) {
        // IF TRUE (LOGGED IN) MAKE TEXT BOX EDITABLE 
        // show submit btn
        $(".submit-comment").removeClass("hide");
        // ADD AVATAR IMG to span w/ class "comment-avatar", link in session storage
        $(".comment-avatar").find('img').remove()
        $('<img>', { src: sessionStorage.getItem("imgLink"), class: "circle prefix", style: "height:50px; width: 50px; margin-right:5px;" }).prependTo(".comment-avatar");
        //<img src="images/yuna.jpg" alt="" class="circle"></img>
        $('.materialize-textarea').val('');
        M.textareaAutoResize($('.materialize-textarea'));
    } else {
        // IF FALSE REPLACE WITH "LOGIN TO COMMENT"
        // hide submit btn
        $(".submit-comment").addClass("hide");
        //DO THIS!!!!!
        $('.materialize-textarea').val('Login to comment');
        M.textareaAutoResize($('.materialize-textarea'));
    }
}

// ON CLICK FOR ADD COMMENT
// Submit comment function
$(document).on("click", ".submit-comment", function () {
    //let thisComCollection = $(this).parents('.collapsible-body').find('.comment-collection')
    event.preventDefault();
    let articleID = $(this).attr("articleID");
    //console.log(articleID)
    event.preventDefault()
    $.ajax({
        method: "POST",
        url: "/comment/" + articleID,
        data: {
            user: sessionStorage.getItem("userID"),
            body: $("#comment_text_" + articleID).val()
        }
    })
        .then(function (data) {
            //console.log(data)
            data.user = {
                _id: sessionStorage.getItem("userID"),
                imgLink: sessionStorage.getItem("imgLink"),
                username: sessionStorage.getItem("username"),
            }
            let comment = populateComments(data);
            $("div.comment-container[articleID='"+ articleID +"']:has(li.comment-placeholder)").empty()
            comment.appendTo("div.comment-container[articleID='"+ articleID +"']")
        });
});

//onclick for scraping date and articles
$(document).on("click", ".scrape-btn", function () {
    event.preventDefault();
    //clear this elemt from tab ul
    $('.scrape-tab').remove()
    // get req for scraping
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
        .then(function (data) {
            $('li.tab > a.active').removeClass("active");
            let newTab = makeTab(data.lastTab, true);
            newTab.appendTo('ul.tabs');
        });
});

// tab-btn
//onclick for changing date view
$(document).on("click", ".tab-btn", function () {
    event.preventDefault();
    let tabID = $(this).attr("tab_id")
    getArticles(tabID);
});


//scrolls to bottom of comments if there are any
$(document).on("click", ".comment-header", function () {
    let box = $(this).next().find('.comment-container');
    box.animate({ scrollTop: $(box).prop("scrollHeight") }, 1000);
});
