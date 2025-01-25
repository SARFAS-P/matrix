'''
import cv2
import face_recognition
import os
import numpy as np

# Path to the folder containing known faces
KNOWN_FACES_DIR = "known_faces"

# Load known faces
def load_known_faces():
    known_encodings = []
    known_names = []
    for filename in os.listdir(KNOWN_FACES_DIR):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            # Load the image and encode the face
            image_path = os.path.join(KNOWN_FACES_DIR, filename)
            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)
            if encodings:  # Ensure at least one face is found
                known_encodings.append(encodings[0])
                known_names.append(os.path.splitext(filename)[0])  # Use filename (without extension) as name
    return known_encodings, known_names

# Initialize known faces
known_face_encodings, known_face_names = load_known_faces()

# Start webcam feed
video_capture = cv2.VideoCapture(0)

print("Press 'q' to quit.")

while True:
    # Capture a frame from the webcam
    ret, frame = video_capture.read()
    if not ret:
        break

    # Resize frame for faster processing
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    rgb_small_frame = small_frame[:, :, ::-1]  # Convert BGR to RGB

    # Find all face locations and encodings in the current frame
    face_locations = face_recognition.face_locations(rgb_small_frame)
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

    for face_encoding, face_location in zip(face_encodings, face_locations):
        # Check if the face matches any known face
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.6)
        name = "Unknown"

        # Use the closest match
        if True in matches:
            match_index = matches.index(True)
            name = known_face_names[match_index]

        # Draw a rectangle around the face
        top, right, bottom, left = face_location
        top, right, bottom, left = top * 4, right * 4, bottom * 4, left * 4  # Scale back to original size
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

        # Add a label with the name
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 255, 0), cv2.FILLED)
        cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 0.6, (255, 255, 255), 1)

    # Display the frame
    cv2.imshow('Face Recognition', frame)

    # Quit with 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and close the window
video_capture.release()
cv2.destroyAllWindows() '''
