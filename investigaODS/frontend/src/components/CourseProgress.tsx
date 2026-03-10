import React from 'react';

interface Course {
  id: string;
  title: string;
  professor: string;
  progress: number;
  progressColor?: string;
}

interface CourseProgressProps {
  courses: Course[];
}

export const CourseProgress: React.FC<CourseProgressProps> = ({ courses }) => {
  return (
    <div style={{ 
      width: '100%',
      maxWidth: '1172px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {courses.map((course) => (
        <div 
          key={course.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {/* Course Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <p style={{ 
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              fontFamily: 'sans-serif'
            }}>
              {course.title}
            </p>
            
            <div style={{ display: 'flex', gap: '35px', fontSize: '16px', color: 'white' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>Profesor:</span>
                <span>{course.professor}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>Avance:</span>
                <span>{course.progress}%</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '21px',
            backgroundColor: '#d9d9d9',
            borderRadius: '100px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${course.progress}%`,
              height: '100%',
              backgroundColor: course.progressColor || '#5dbb46',
              borderRadius: '100px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      ))}
    </div>
  );
};
