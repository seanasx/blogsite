let loggedIn = false;
let userId;

window.addEventListener("DOMContentLoaded", async () =>
{
    await fetchAndDisplayBlogPosts();
});

// display blog posts
async function fetchAndDisplayBlogPosts()
{
    try
    {
        // get all blog posts
        const blogResponse = await fetch("/blogs/");
        if (!blogResponse.ok)
        {
            throw new Error("Failed to fetch blog posts");
        }
        const blogPosts = await blogResponse.json();

        // get all author details
        await Promise.all(blogPosts.map(async (blogPost) =>
        {
            const authorResponse = await fetch(`/users/${blogPost.author}`);
            if (!authorResponse.ok)
            {
                throw new Error("Failed to fetch author details");
            }
            const authData = await authorResponse.json();
            blogPost.authorName = authData.firstName + " " + authData.lastName;
        }));

        // get all comment details
        await Promise.all(blogPosts.map(async (blogPost) =>
        {
            await Promise.all(blogPost.comments.map(async (comment) =>
            {
                const userResponse = await fetch(`/users/${comment.user}`);
                if (!userResponse.ok)
                {
                    throw new Error("Failed to fetch user details");
                }
                const userData = await userResponse.json();
                comment.firstName = userData.firstName + " " + userData.lastName;
            }));
        }));

        await displayBlogPost(blogPosts);
    }
    catch (error)
    {
        console.error("Error fetching content", error.message);
    }
}

async function displayBlogPost(blogPosts)
{
    const blogPostContainer = document.getElementById("blogPosts");
    blogPostContainer.innerHTML = " ";

    blogPosts.forEach(blogPost =>
    {
        const cardElement = createBlogPostCard(blogPost);
        blogPostContainer.appendChild(cardElement);
    })
}


function createBlogPostCard(blogPost)
{
    const cardElement = document.createElement("div");
    cardElement.classList.add("blog-post-card");

    const titleElement = document.createElement("h3");
    titleElement.textContent = blogPost.title;
    titleElement.classList.add("titleText");

    const authorElement = document.createElement("p");
    authorElement.textContent = `${blogPost.authorName}`;
    authorElement.classList.add("author");

    const contentElement = document.createElement("p");
    contentElement.textContent = blogPost.content;
    contentElement.classList.add("contentText");

    const postLikesBtn = createLikeBtn(blogPost.likes);

    postLikesBtn.addEventListener("click", async () =>
    {
        if (blogPost.liked || !loggedIn)
        {
            return;
        }

        try
        {
            const response = await fetch(`/blogs/like/${blogPost._id}`,
                {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"}
                })

            if (!response.ok)
            {
                throw new Error("Failed to like blog post; please try again.")
            }

            blogPost.likes++;
            postLikesBtn.querySelector(".likesCount").textContent = `${blogPost.likes}`;
            blogPost.liked = true;
        }
        catch (error)
        {
            console.error("Error: ", error.message);
        }
    })

    const commentsElement = createComments(blogPost);

    cardElement.appendChild(titleElement);
    cardElement.appendChild(authorElement);
    cardElement.appendChild(postLikesBtn);
    cardElement.appendChild(contentElement);
    cardElement.appendChild(commentsElement);

    if (loggedIn)
    {
        const commentForm = createCmtForm(blogPost._id);
        cardElement.appendChild(commentForm);
    }

    return cardElement;
}

function createLikeBtn(likes)
{
    const likesBtn = document.createElement("button");
    likesBtn.classList.add("likesBtn");

    const likeIcon = document.createElement("img");
    likeIcon.id = "likeIcon";
    likeIcon.src = "resources/thumb_up.png";
    likeIcon.alt = "like icon";

    const likesCount = document.createElement("span");
    likesCount.textContent = `${likes}`;
    likesCount.classList.add("likesCount");

    likesBtn.appendChild(likeIcon);
    likesBtn.appendChild(likesCount);

    if (loggedIn)
    {
        likesBtn.onclick = () =>
        {
            likesCount.style.fontWeight = "bold";
        }
    }

    return likesBtn;
}


function createComments(blogPosts)
{
    const commentsElement = document.createElement("ul");
    commentsElement.classList.add("comment-list");

    blogPosts.comments.forEach((comment, index) =>
    {
        const commentItem = document.createElement("li");

        const userIcon = document.createElement("img");
        userIcon.id = "profileIcon";
        userIcon.src = "resources/profile_icon.png";
        userIcon.alt = "profile icon";

        const commentContent = document.createElement("span");
        commentContent.textContent = `${comment.firstName}:  ${comment.content}`;

        const cmtLikesBtn = createLikeBtn(comment.likes);
        cmtLikesBtn.classList.add("cmtLikesBtn");

        commentItem.appendChild(userIcon);
        commentItem.appendChild(commentContent);
        commentItem.appendChild(cmtLikesBtn);
        commentsElement.appendChild(commentItem);

        cmtLikesBtn.addEventListener("click", async () =>
        {
            if (comment.liked || !loggedIn)
            {
                return;
            }

            try
            {
                const response = await fetch(`/blogs/comment/like/${index}/${blogPosts._id}`,
                    {
                        method: "PUT",
                        headers: {"Content-Type": "application/json"}
                    })

                if (!response.ok)
                {
                    throw new Error("Failed to like blog post; please try again.")
                }

                comment.likes++;
                cmtLikesBtn.querySelector(".likesCount").textContent = `${comment.likes}`;
                cmtLikesBtn.classList.add("liked");
                comment.liked = true;
            }
            catch (error)
            {
                console.error("Error: ", error.message);
            }
        });
    });

    return commentsElement;
}


function createCmtForm(blogPostId)
{
    const commentForm = document.createElement("form");
    commentForm.classList.add("comment-form");

    const cmtTextArea = document.createElement("textarea");
    cmtTextArea.setAttribute("placeholder", "Write your comment...");
    cmtTextArea.setAttribute("name", "cmtArea");
    cmtTextArea.id = "cmtArea";
    cmtTextArea.classList.add("form-control", "cmt", "mb-2");
    commentForm.appendChild(cmtTextArea);

    const submitBtn = document.createElement("button");
    submitBtn.setAttribute("type", "submit");
    submitBtn.id = "cmtPostBtn";
    submitBtn.textContent = "Comment";
    submitBtn.classList.add("btn", "btn-primary");
    commentForm.appendChild(submitBtn);

    submitBtn.disabled = true;
    cmtTextArea.oninput = function ()
    {
        if (document.getElementById("cmtArea").value.length === 0)
        {
            document.getElementById("cmtPostBtn").disabled = true;
        }
        else
        {
            document.getElementById("cmtPostBtn").disabled = false;
        }
    }

    commentForm.addEventListener("submit", async (event) =>
    {
        event.preventDefault();

        if (!loggedIn)
        {
            console.log("Please log in to submit a comment.")
            return;
        }

        const formData = new FormData(commentForm);
        const commentContent = formData.get("cmtArea");

        try
        {
            const response = await fetch(`/blogs/comment/${blogPostId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: commentContent, userID: userId })
                });

            if (!response.ok)
            {
                throw new Error("Failed to add comment; please try again.");
            }

            commentForm.reset();
            console.log("Comment added successfully.");
            await fetchAndDisplayBlogPosts();
        }
        catch (error)
        {
            console.log("Error: ", error.message);
        }
    });

    return commentForm;
}

// handling log-in form
document.getElementById("logForm").addEventListener("submit", async (event) =>
{
    event.preventDefault();

    const formData = new FormData(event.target);
    const lastName = formData.get("logLastName");
    const email = formData.get("logEmail");

    try
    {
        const response = await fetch("/users/login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lastName, email })
            });

        if (!response.ok)
        {
            throw new Error("Log-in failed; please try again.")
        }

        const data = await response.json();
        userId = data._id;
        loggedIn = true;

        console.log("Log in successful", data);

        document.getElementById("logInContainer").style.display = "none";
        document.getElementById("postContainer").style.display = "block";
        document.getElementById("contentInput").value = "";
        document.getElementById("logOutBtn").style.display = "inline";
        document.getElementById("nameLabel").innerHTML = `<p>Hello, ${data.firstName}!</p>`;

        await fetchAndDisplayBlogPosts();
    }
    catch (error)
    {
        console.log("Error: ", error.message);
    }
});


// handling blog post form
document.getElementById("blogForm").addEventListener("submit", async (event) =>
{
    event.preventDefault();

    const formData = new FormData(event.target);
    const title = formData.get("title");
    const content = formData.get("contentInput");

    try
    {
        const response = await fetch("/blogs",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, author: userId })
            });

        if (!response.ok)
        {
            throw new Error("Failed to create new blog post; try again.")
        }

        event.target.reset();

        await fetchAndDisplayBlogPosts();

        console.log("Successfully created blog post.")

        document.getElementById("title").value = "";
        document.getElementById("title").placeholder = "Enter your title...";
        document.getElementById("contentInput").value = "";
        document.getElementById("contentInput").placeholder = "Enter your content...";

        enablePostBtn();
    }
    catch (error)
    {
        console.log("Error: ", error.message);
    }
});