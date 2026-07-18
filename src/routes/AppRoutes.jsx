import { Routes, Route } from "react-router-dom";
import BlogFeedContainer from "../containers/BlogFeedContainer";
import AuthorsContainer from "../containers/AuthorsContainer";
import AboutContainer from "../containers/AboutContainer";

// TODO: uncomment and wire up as each container is built
// import LoginContainer from "../containers/LoginContainer";
// import SignupContainer from "../containers/SignupContainer";
// import SetUsernameContainer from "../containers/SetUsernameContainer";
// import PostDetailContainer from "../containers/PostDetailContainer";
// import CreateEditPostContainer from "../containers/CreateEditPostContainer";
// import ProfileContainer from "../containers/ProfileContainer";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<BlogFeedContainer />} />
      <Route path="/authors" element={<AuthorsContainer />} />
      <Route path="/about" element={<AboutContainer />} />

      {/* TODO: add these as pages get built */}
      {/* <Route path="/login" element={<LoginContainer />} /> */}
      {/* <Route path="/signup" element={<SignupContainer />} /> */}
      {/* <Route path="/set-username" element={<SetUsernameContainer />} /> */}
      {/* <Route path="/post/:postId" element={<PostDetailContainer />} /> */}
      {/* <Route path="/create-post" element={<CreateEditPostContainer />} /> */}
      {/* <Route path="/edit-post/:postId" element={<CreateEditPostContainer />} /> */}
      {/* <Route path="/profile/:username" element={<ProfileContainer />} /> */}
    </Routes>
  );
}
