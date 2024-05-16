import Blog from "./Blog";
import {screen, render} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test('<Blog />', async () => {
  const blog = {
    title: 'Hello World',
    author: 'John Doe',
    url: 'no url',
    likes: 0
  }

  const {container } = render(<Blog blog={blog} />)

  const viewButton = screen.getByText('view')
  const user = userEvent.setup()
  await user.click(viewButton)

  const author = container.querySelector('.author')
  expect(author).toHaveTextContent('John Doe')
})