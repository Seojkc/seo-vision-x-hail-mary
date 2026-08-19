import Welcome from './Sections/welcome'
import Theory from './Sections/stringTheory'
import Introduction from './Sections/Introduction';
import GraceToDoor from './Sections/graceToDoor';
import  Funfacts from './Sections/funFacts';
import Skills from './Sections/Skills';
import Projects from './Sections/Projects';
import GithubSection from './Sections/github';


export default function Home() {
  return (
    <div className='overflow-x-hidden gabriela-regular'>
      
      <Welcome />
      <Introduction/>

      <GraceToDoor/>

      <Projects/>
      
      

      <Skills/>
      <Funfacts/>
      <GithubSection/>
      
      
      <Theory/>

      
    </div>
  );
}
