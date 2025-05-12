
import Layout from "../../Components/Layout";
import "./style.css";
import profile from "./img/profile.jpg";
import instagram from "./img/insta.png";
import postImg from "./img/post-img.jpeg";

const BrandOverviewPage = () => {
  // Custom Dropdown Function
  // $(function () {
  //   $(".dropdown-menu li").on( "click", function() {
  //     // Getting ID of dropdown
  //     var btn = $(this).parent().attr('aria-labelledby');
  //     // Image Source of dropdown Content
  //     var imgSrc = $(this).children('img').attr('src');
  //     // Replacing value
  //      $(`#${btn}`).children('span').text($(this).text());
  //      $(`#${btn}`).children('img').attr('src', imgSrc);
  //   });
  // });
  // End of Custom Dropdown

  // Custom Sidebar for Mobile
  // function openNav() {
  // document.getElementById("mySidenav").style.width = "250px";
  // document.getElementById('overlay').classList.add("overlay-toggle");
  // }

  // function closeNav() {
  // document.getElementById("mySidenav").style.width = "0";
  // document.getElementById('overlay').classList.remove("overlay-toggle");
  // }
  // End of Custom Sidebar for Mobile

  return (
    <Layout>
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        crossorigin="anonymous"
      ></link>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
      <section className="top-filter" style={{ marginTop: 75 }}>
        <div className="container-fluid">
          <div className="sort-like-comment">
            <div className="form-group filter-select">
              <select id="inputState" className="form-control">
                <option selected>Sort By</option>
                <option>Like</option>
                <option>Comment</option>
              </select>
            </div>
          </div>
          <div className="filterType">
            <div className="form-group filter-select">
              <select id="inputState" className="form-control">
                <option selected>All Types</option>
                <option>Images</option>
                <option>Videos</option>
                <option>Links</option>
                <option>Texts</option>
              </select>
            </div>
          </div>
          <div className="filterDays">
            <div className="form-group filter-select filter-select-icon">
              <div className="input-group">
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <i className="fas fa-calendar-alt" />
                  </div>
                </div>
                <select id="inputState" className="form-control">
                  <option>Today</option>
                  <option selected>Last 7 Days</option>
                  <option>Last Month</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>
          </div>
          <div className="downloadButton">
            <button className="btn btn-outlined">
              <i className="fas fa-download" />
            </button>
          </div>
        </div>
      </section>
      <section className="profile-section">
        <div className="container-fluid profile-section-container">
          <div className="profile-filter-container">
            <div className="dropdown custom-dropdown">
              <button
                className="btn btn-outlined dropdown-toggle"
                type="button"
                id="profile-filter"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img src={profile} style={{ width: "30px", height: "30px" }} />{" "}
                <span>Brand</span>
              </button>
              <ul className="dropdown-menu" aria-labelledby="profile-filter">
                <li className="dropdown-item">
                  <img src={profile} /> <span>Brand Name 1</span>
                </li>
                <li className="dropdown-item">
                  <img src={profile} /> <span>Brand Name 2</span>
                </li>
                <li className="dropdown-item">
                  <img src={profile} /> <span>Brand Name 3</span>
                </li>
              </ul>
            </div>
            {/* <div className="dropdown custom-dropdown">
                <button className="btn btn-outlined dropdown-toggle" type="button" id="profile-filter-competitor" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <img src={profile} style={{width: '30px', height: '30px'}} /> <span>Competitor Brand</span>
                </button>
                <ul className="dropdown-menu" aria-labelledby="profile-filter-competitor">
                  <li className="dropdown-item">
                    <img src={profile} /> <span>Competitor Brand 1</span>
                  </li>
                  <li className="dropdown-item">
                    <img src={profile} /> <span>Competitor Brand 2</span>
                  </li>
                  <li className="dropdown-item">
                    <img src={profile} /> <span>Competitor Brand 3</span>
                  </li>
                </ul>
              </div> */}
          </div>
          <div className="content-newsfeed">
            <img src={instagram} alt="instagram" />
            <h2>Content Newsfeed</h2>
          </div>
        </div>
      </section>
      <section className="search">
        <div className="container search-container">
          <div className="search-bar">
            <div className="form-group has-search">
              <span className="fa fa-search form-control-feedback" />
              <input
                type="text"
                className="form-control"
                placeholder="Search"
              />
            </div>
          </div>
          <div className="tags">
            <span className="tag-item">
              #best
              <i className="fas fa-times" />
            </span>
            <span className="tag-item">
              chicago
              <i className="fas fa-times" />
            </span>
            <span className="tag-item">
              <img src={profile} alt="" />
              The Hunter &amp; Barrel
              <i className="fas fa-times" />
            </span>
            {/* Clear All */}
            <a href="#" id="clear-tags">
              Clear All
            </a>
            {/* Clear All */}
          </div>
        </div>
      </section>
      <section className="post">
        <div className="container-fluid">
          <h5>11 Results</h5>
          <div className="row">
            <div className="col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="post-title-main">
                    <div className="profile-left">
                      <div className="profile-img">
                        <img src={profile} />
                      </div>
                      <div className="profile-details">
                        <h5 className="card-title">The Hunter &amp; Barrel</h5>
                        <p className="card-text">
                          <small className="text-muted">2 hours ago</small>
                        </p>
                      </div>
                    </div>
                    <div className="social-icon">
                      <img src={instagram} alt="" />
                    </div>
                  </div>
                  <div className="post-content">
                    <p className="card-text">
                      Ray by <a href="#">@gilhuybrecht</a>— It is a cosmetics
                      company that focusses on good ingredients while not
                      harming our mother earth.
                    </p>
                    <p className="card-text">
                      <a href="#">https://www.instagram.com/p/N-ClndHgkjx/</a>
                    </p>
                  </div>
                  <div className="post-image">
                    <img
                      className="card-img-top"
                      src={postImg}
                      alt="Card image cap"
                    />
                  </div>
                  <div className="post-details">
                    <div className="row">
                      <div className="col-lg-12 post-detail total-engagements">
                        <div className="details">
                          <p className="count">40</p>
                          <p>Total Engagements</p>
                        </div>
                        <div className="form-check download-multiple">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="multiple-download"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-6 post-detail likes">
                        <p>Likes</p>
                        <p className="count">567</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail comments">
                        <p>Comments</p>
                        <p className="count">237</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail favourites">
                        <p>Favourites</p>
                        <p className="count">12</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail other-engagements">
                        <p>Other Engagements</p>
                        <p className="count">1</p>
                      </div>
                      <div className="col-lg-12 post-detail post-options pull-right">
                        <div className="report">
                          <div className="downloadButton">
                            <button className="btn btn-outlined">
                              <i className="fas fa-flag" />
                            </button>
                          </div>
                        </div>
                        <div className="downloadButton">
                          <button className="btn btn-outlined">
                            <i className="fas fa-download" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="post-title-main">
                    <div className="profile-left">
                      <div className="profile-img">
                        <img src={profile} />
                      </div>
                      <div className="profile-details">
                        <h5 className="card-title">The Hunter &amp; Barrel</h5>
                        <p className="card-text">
                          <small className="text-muted">2 hours ago</small>
                        </p>
                      </div>
                    </div>
                    <div className="social-icon">
                      <img src={instagram} alt="" />
                    </div>
                  </div>
                  <div className="post-content">
                    <p className="card-text">
                      Ray by <a href="#">@gilhuybrecht</a>— It is a cosmetics
                      company that focusses on good ingredients while not
                      harming our mother earth.
                    </p>
                    <p className="card-text">
                      <a href="#">https://www.instagram.com/p/N-ClndHgkjx/</a>
                    </p>
                  </div>
                  <div className="post-image">
                    <img
                      className="card-img-top"
                      src={postImg}
                      alt="Card image cap"
                    />
                  </div>
                  <div className="post-details">
                    <div className="row">
                      <div className="col-lg-12 post-detail total-engagements">
                        <div className="details">
                          <p className="count">40</p>
                          <p>Total Engagements</p>
                        </div>
                        <div className="form-check download-multiple">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="multiple-download"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-6 post-detail likes">
                        <p>Likes</p>
                        <p className="count">567</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail comments">
                        <p>Comments</p>
                        <p className="count">237</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail favourites">
                        <p>Favourites</p>
                        <p className="count">12</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail other-engagements">
                        <p>Other Engagements</p>
                        <p className="count">1</p>
                      </div>
                      <div className="col-lg-12 post-detail post-options pull-right">
                        <div className="report">
                          <div className="downloadButton">
                            <button className="btn btn-outlined">
                              <i className="fas fa-flag" />
                            </button>
                          </div>
                        </div>
                        <div className="downloadButton">
                          <button className="btn btn-outlined">
                            <i className="fas fa-download" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="post-title-main">
                    <div className="profile-left">
                      <div className="profile-img">
                        <img src={profile} />
                      </div>
                      <div className="profile-details">
                        <h5 className="card-title">The Hunter &amp; Barrel</h5>
                        <p className="card-text">
                          <small className="text-muted">2 hours ago</small>
                        </p>
                      </div>
                    </div>
                    <div className="social-icon">
                      <img src={instagram} alt="" />
                    </div>
                  </div>
                  <div className="post-content">
                    <p className="card-text">
                      Ray by <a href="#">@gilhuybrecht</a>— It is a cosmetics
                      company that focusses on good ingredients while not
                      harming our mother earth.
                    </p>
                    <p className="card-text">
                      <a href="#">https://www.instagram.com/p/N-ClndHgkjx/</a>
                    </p>
                  </div>
                  <div className="post-image">
                    <img
                      className="card-img-top"
                      src={postImg}
                      alt="Card image cap"
                    />
                  </div>
                  <div className="post-details">
                    <div className="row">
                      <div className="col-lg-12 post-detail total-engagements">
                        <div className="details">
                          <p className="count">40</p>
                          <p>Total Engagements</p>
                        </div>
                        <div className="form-check download-multiple">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="multiple-download"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-6 post-detail likes">
                        <p>Likes</p>
                        <p className="count">567</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail comments">
                        <p>Comments</p>
                        <p className="count">237</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail favourites">
                        <p>Favourites</p>
                        <p className="count">12</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail other-engagements">
                        <p>Other Engagements</p>
                        <p className="count">1</p>
                      </div>
                      <div className="col-lg-12 post-detail post-options pull-right">
                        <div className="report">
                          <div className="downloadButton">
                            <button className="btn btn-outlined">
                              <i className="fas fa-flag" />
                            </button>
                          </div>
                        </div>
                        <div className="downloadButton">
                          <button className="btn btn-outlined">
                            <i className="fas fa-download" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="post-title-main">
                    <div className="profile-left">
                      <div className="profile-img">
                        <img src={profile} />
                      </div>
                      <div className="profile-details">
                        <h5 className="card-title">The Hunter &amp; Barrel</h5>
                        <p className="card-text">
                          <small className="text-muted">2 hours ago</small>
                        </p>
                      </div>
                    </div>
                    <div className="social-icon">
                      <img src={instagram} alt="" />
                    </div>
                  </div>
                  <div className="post-content">
                    <p className="card-text">
                      Ray by <a href="#">@gilhuybrecht</a>— It is a cosmetics
                      company that focusses on good ingredients while not
                      harming our mother earth.
                    </p>
                    <p className="card-text">
                      <a href="#">https://www.instagram.com/p/N-ClndHgkjx/</a>
                    </p>
                  </div>
                  <div className="post-image">
                    <img
                      className="card-img-top"
                      src={postImg}
                      alt="Card image cap"
                    />
                  </div>
                  <div className="post-details">
                    <div className="row">
                      <div className="col-lg-12 post-detail total-engagements">
                        <div className="details">
                          <p className="count">40</p>
                          <p>Total Engagements</p>
                        </div>
                        <div className="form-check download-multiple">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="multiple-download"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-6 post-detail likes">
                        <p>Likes</p>
                        <p className="count">567</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail comments">
                        <p>Comments</p>
                        <p className="count">237</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail favourites">
                        <p>Favourites</p>
                        <p className="count">12</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail other-engagements">
                        <p>Other Engagements</p>
                        <p className="count">1</p>
                      </div>
                      <div className="col-lg-12 post-detail post-options pull-right">
                        <div className="report">
                          <div className="downloadButton">
                            <button className="btn btn-outlined">
                              <i className="fas fa-flag" />
                            </button>
                          </div>
                        </div>
                        <div className="downloadButton">
                          <button className="btn btn-outlined">
                            <i className="fas fa-download" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="post-title-main">
                    <div className="profile-left">
                      <div className="profile-img">
                        <img src={profile} />
                      </div>
                      <div className="profile-details">
                        <h5 className="card-title">The Hunter &amp; Barrel</h5>
                        <p className="card-text">
                          <small className="text-muted">2 hours ago</small>
                        </p>
                      </div>
                    </div>
                    <div className="social-icon">
                      <img src={instagram} alt="" />
                    </div>
                  </div>
                  <div className="post-content">
                    <p className="card-text">
                      Ray by <a href="#">@gilhuybrecht</a>— It is a cosmetics
                      company that focusses on good ingredients while not
                      harming our mother earth.
                    </p>
                    <p className="card-text">
                      <a href="#">https://www.instagram.com/p/N-ClndHgkjx/</a>
                    </p>
                  </div>
                  <div className="post-image">
                    <img
                      className="card-img-top"
                      src={postImg}
                      alt="Card image cap"
                    />
                  </div>
                  <div className="post-details">
                    <div className="row">
                      <div className="col-lg-12 post-detail total-engagements">
                        <div className="details">
                          <p className="count">40</p>
                          <p>Total Engagements</p>
                        </div>
                        <div className="form-check download-multiple">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="multiple-download"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-6 post-detail likes">
                        <p>Likes</p>
                        <p className="count">567</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail comments">
                        <p>Comments</p>
                        <p className="count">237</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail favourites">
                        <p>Favourites</p>
                        <p className="count">12</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail other-engagements">
                        <p>Other Engagements</p>
                        <p className="count">1</p>
                      </div>
                      <div className="col-lg-12 post-detail post-options pull-right">
                        <div className="report">
                          <div className="downloadButton">
                            <button className="btn btn-outlined">
                              <i className="fas fa-flag" />
                            </button>
                          </div>
                        </div>
                        <div className="downloadButton">
                          <button className="btn btn-outlined">
                            <i className="fas fa-download" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="post-title-main">
                    <div className="profile-left">
                      <div className="profile-img">
                        <img src={profile} />
                      </div>
                      <div className="profile-details">
                        <h5 className="card-title">The Hunter &amp; Barrel</h5>
                        <p className="card-text">
                          <small className="text-muted">2 hours ago</small>
                        </p>
                      </div>
                    </div>
                    <div className="social-icon">
                      <img src={instagram} alt="" />
                    </div>
                  </div>
                  <div className="post-content">
                    <p className="card-text">
                      Ray by <a href="#">@gilhuybrecht</a>— It is a cosmetics
                      company that focusses on good ingredients while not
                      harming our mother earth.
                    </p>
                    <p className="card-text">
                      <a href="#">https://www.instagram.com/p/N-ClndHgkjx/</a>
                    </p>
                  </div>
                  <div className="post-image">
                    <img
                      className="card-img-top"
                      src={postImg}
                      alt="Card image cap"
                    />
                  </div>
                  <div className="post-details">
                    <div className="row">
                      <div className="col-lg-12 post-detail total-engagements">
                        <div className="details">
                          <p className="count">40</p>
                          <p>Total Engagements</p>
                        </div>
                        <div className="form-check download-multiple">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="multiple-download"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-6 post-detail likes">
                        <p>Likes</p>
                        <p className="count">567</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail comments">
                        <p>Comments</p>
                        <p className="count">237</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail favourites">
                        <p>Favourites</p>
                        <p className="count">12</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail other-engagements">
                        <p>Other Engagements</p>
                        <p className="count">1</p>
                      </div>
                      <div className="col-lg-12 post-detail post-options pull-right">
                        <div className="report">
                          <div className="downloadButton">
                            <button className="btn btn-outlined">
                              <i className="fas fa-flag" />
                            </button>
                          </div>
                        </div>
                        <div className="downloadButton">
                          <button className="btn btn-outlined">
                            <i className="fas fa-download" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="post-title-main">
                    <div className="profile-left">
                      <div className="profile-img">
                        <img src={profile} />
                      </div>
                      <div className="profile-details">
                        <h5 className="card-title">The Hunter &amp; Barrel</h5>
                        <p className="card-text">
                          <small className="text-muted">2 hours ago</small>
                        </p>
                      </div>
                    </div>
                    <div className="social-icon">
                      <img src={instagram} alt="" />
                    </div>
                  </div>
                  <div className="post-content">
                    <p className="card-text">
                      Ray by <a href="#">@gilhuybrecht</a>— It is a cosmetics
                      company that focusses on good ingredients while not
                      harming our mother earth.
                    </p>
                    <p className="card-text">
                      <a href="#">https://www.instagram.com/p/N-ClndHgkjx/</a>
                    </p>
                  </div>
                  <div className="post-image">
                    <img
                      className="card-img-top"
                      src={postImg}
                      alt="Card image cap"
                    />
                  </div>
                  <div className="post-details">
                    <div className="row">
                      <div className="col-lg-12 post-detail total-engagements">
                        <div className="details">
                          <p className="count">40</p>
                          <p>Total Engagements</p>
                        </div>
                        <div className="form-check download-multiple">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="multiple-download"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-6 post-detail likes">
                        <p>Likes</p>
                        <p className="count">567</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail comments">
                        <p>Comments</p>
                        <p className="count">237</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail favourites">
                        <p>Favourites</p>
                        <p className="count">12</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail other-engagements">
                        <p>Other Engagements</p>
                        <p className="count">1</p>
                      </div>
                      <div className="col-lg-12 post-detail post-options pull-right">
                        <div className="report">
                          <div className="downloadButton">
                            <button className="btn btn-outlined">
                              <i className="fas fa-flag" />
                            </button>
                          </div>
                        </div>
                        <div className="downloadButton">
                          <button className="btn btn-outlined">
                            <i className="fas fa-download" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="card">
                <div className="card-body">
                  <div className="post-title-main">
                    <div className="profile-left">
                      <div className="profile-img">
                        <img src={profile} />
                      </div>
                      <div className="profile-details">
                        <h5 className="card-title">The Hunter &amp; Barrel</h5>
                        <p className="card-text">
                          <small className="text-muted">2 hours ago</small>
                        </p>
                      </div>
                    </div>
                    <div className="social-icon">
                      <img src={instagram} alt="" />
                    </div>
                  </div>
                  <div className="post-content">
                    <p className="card-text">
                      Ray by <a href="#">@gilhuybrecht</a>— It is a cosmetics
                      company that focusses on good ingredients while not
                      harming our mother earth.
                    </p>
                    <p className="card-text">
                      <a href="#">https://www.instagram.com/p/N-ClndHgkjx/</a>
                    </p>
                  </div>
                  <div className="post-image">
                    <img
                      className="card-img-top"
                      src={postImg}
                      alt="Card image cap"
                    />
                  </div>
                  <div className="post-details">
                    <div className="row">
                      <div className="col-lg-12 post-detail total-engagements">
                        <div className="details">
                          <p className="count">40</p>
                          <p>Total Engagements</p>
                        </div>
                        <div className="form-check download-multiple">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="multiple-download"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-6 post-detail likes">
                        <p>Likes</p>
                        <p className="count">567</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail comments">
                        <p>Comments</p>
                        <p className="count">237</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail favourites">
                        <p>Favourites</p>
                        <p className="count">12</p>
                      </div>
                      <div className="col-lg-6 col-6 post-detail other-engagements">
                        <p>Other Engagements</p>
                        <p className="count">1</p>
                      </div>
                      <div className="col-lg-12 post-detail post-options pull-right">
                        <div className="report">
                          <div className="downloadButton">
                            <button className="btn btn-outlined">
                              <i className="fas fa-flag" />
                            </button>
                          </div>
                        </div>
                        <div className="downloadButton">
                          <button className="btn btn-outlined">
                            <i className="fas fa-download" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
        integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous">
        </script> */}
      {/* <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" /> */}
    </Layout>
  );
};

export default BrandOverviewPage;
