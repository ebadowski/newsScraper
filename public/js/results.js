
let testOBJ = {
    comments: [
        {
            comment: "this is the first comment",
            username: "zeke",
            imgLink: "https://www.stickpng.com/assets/images/5cb78e867ff3656569c8cebe.png"
        },
        {
            comment: "this is the second comment",
            username: "test",
            imgLink: "https://vignette.wikia.nocookie.net/spongebobgalaxy/images/0/07/SpongeBob_SquarePants.png/revision/latest?cb=20171228024014"
        },
        {
            comment: "this is the third comment",
            username: "zeke",
            imgLink: "https://www.stickpng.com/assets/images/5cb78e867ff3656569c8cebe.png"
        },
        {
            comment: "this is the fourth comment",
            username: "test",
            imgLink: "https://vignette.wikia.nocookie.net/spongebobgalaxy/images/0/07/SpongeBob_SquarePants.png/revision/latest?cb=20171228024014"
        },
        {
            comment: "this is the fifth comment",
            username: "zeke",
            imgLink: "https://www.stickpng.com/assets/images/5cb78e867ff3656569c8cebe.png"
        }
    ]
}

$(document).ready(function () {
    $('.collapsible').collapsible();

    buildTabs();

});

function buildTabs() {
    getTabs(function () {
        //check if la
        let tabID = $('li.tab > a.active').attr('tab_id');
        console.log(tabID)
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
    console.log(obj)
    console.log(bool);
    let li = $('<li>', { class: 'tab col s3' });
    let a = $('<a>', {
        class: "tab-btn",
        tab_id: obj._id
    }).text(obj.date).appendTo(li);

    if (bool) { a.addClass("active") }
    return li;
}
//CHANGE TO ONLY GET THE ONE TAB'S ARTICLES
function getArticles(tabID) {
    $('.article-list').empty()
    $.ajax({
        method: "GET",
        url: "/articles/"+tabID
    })
        // With that done
        .then(function (data) {
            // Log the response
            articles = data[0].articles
            console.log(data);
            console.log(articles);
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
    let commentDiv = $('<div>', { class: "container comment-container", style: "max-height: 250px; overflow: scroll;" }).appendTo(commentBody);


    //CHANGE COMMENT TO LIST HERE
    //COMMENTED OUT FOR TESTING !!!!!!!!!!!!! CHANGE BACK !!!!!!!!!!!!!!!!!!!
    //if (obj.comments.length > 0) {
    if (testOBJ.comments.length > 0) {
        let commentList = $('<ul>', { class: 'collection' }).appendTo(commentDiv);
        //  for (var i in obj.comments) {
        for (var i in testOBJ.comments) {
            //let comment = populateComments(obj.comments[i]);
            let comment = populateComments(testOBJ.comments[i]);

            comment.appendTo(commentList)
        }

    } else {
        let pCom = $('<p>').text("No Comments Yet").appendTo(commentDiv);
    }
    $('<br>').appendTo(commentBody);
    $('<div>', { class: 'divider' }).appendTo(commentBody);

    // make comment text box and submit btn
    let form = $('<form>').appendTo(commentBody);
    //let inputBody = $('<div>', { class: "input-field" }).appendTo(form);
    $('<br>').appendTo(form);
    let row = $('<div>', { class: "row" }).appendTo(form)
    let field = $('<div>', { class: "input-field comment-avatar", style: 'width: 100%' }).appendTo(row);
    $('<textarea>', { id: ("comment_text_" + obj._id), class: "materialize-textarea right", style: "width: 80%; margin-left:5px;" }).appendTo(field);
    $('<label>', { for: ("comment_text_" + obj._id), style: "padding-left:25px;" }).text("Comment").appendTo(field);

    $('<a>', {
        "articleID": obj._id,
        class: 'waves-effect waves-teal btn-flat right submit-comment'
    }).text('Submit').appendTo(form);
    $('<br>').appendTo(form);

    // adds link button
    $('<div>', { class: 'divider' }).appendTo(divBody);
    let linkbtn = $('<a>', {
        id: "link_" + obj._id,
        href: obj.link,
        class: 'waves-effect waves-teal btn-flat right'
    }).text('Link').appendTo(divBody)
    $('<br>').appendTo(divBody)
    li.appendTo('.article-list');
}

function populateComments(obj) {

    // MAKE COMMENT WITH USERNAME AND IMAGE
    let comment = $('<li>', { class: "collection-item avatar", style: "height:auto" });
    $('<img>', { src: obj.imgLink, class: "circle", style: "height:25px; width: 25px;" }).appendTo(comment);
    $('<span>', { class: "title" }).text(obj.username).appendTo(comment);
    $('<p>').text(obj.comment).appendTo(comment);

    return comment;
}



// VERIFICATION IF LOGGED IN
function changeCommentTextBox(bool) {
    if (bool) {
        // IF TRUE (LOGGED IN) MAKE TEXT BOX EDITABLE 
        // show submit btn
        $(".submit-comment").removeClass("hide");
        // ADD AVATAR IMG to span w/ class "comment-avatar", link in session storage
        $('<img>', { src: sessionStorage.getItem("imgLink"), class: "circle prefix", style: "height:50px; width: 50px; margin-right:5px;" }).prependTo(".comment-avatar");
        //<img src="images/yuna.jpg" alt="" class="circle"></img>
    } else {
        // IF FALSE REPLACE WITH "LOGIN TO COMMENT"
        // hide submit btn
        $(".submit-comment").addClass("hide");
        //DO THIS!!!!!
        // $('.materialize-textarea').val('Login to comment');
        // M.textareaAutoResize($('.materialize-textarea'));
    }
}

// ON CLICK FOR ADD COMMENT
// Submit comment function
$(document).on("click", ".submit-comment", function () {
    event.preventDefault();
    let articleID = $(this).attr("articleID");
    console.log(articleID)
    event.preventDefault()
    $.ajax({
        method: "POST",
        url: "/comment/" + articleID,
        data: {
            user: sessionStorage.getItem("userID"),
            body: $("#comment_text_" + articleID).val()
        }
    })
        // With that done
        .then(function (data) {
            console.log(data)
        });
});

//onclick for scraping date and articles
$(document).on("click", ".scrape-btn", function () {
    event.preventDefault();
    console.log('hit')
    //clear this elemt from tab ul
    $('.scrape-tab').remove()
    // get req for scraping
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
        .then(function (data) {
            console.log(data.lastTab)
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
    getArticles(tabID)

    // //clear this elemt from tab ul
    // $('.scrape-tab').remove()
    // // get req for scraping
    // $.ajax({
    //     method: "GET",
    //     url: "/scrape"
    // })
    //     .then(function (data) {
    //         console.log(data.lastTab)
    //         $('li.tab > a.active').removeClass("active");
    //         let newTab = makeTab(data.lastTab, true);
    //         newTab.appendTo('ul.tabs');
    //     });
});


//scrolls to bottom of comments if there are any
$(document).on("click", ".comment-header", function () {
    console.log("HIT")
    let box = $(this).next().find('.comment-container');
    box.animate({ scrollTop: $(box).prop("scrollHeight") }, 1000);
});
