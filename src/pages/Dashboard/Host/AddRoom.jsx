import React, { useState } from 'react';
import AddRoomForm from '../../../components/From/AddRoomFrom';
import useAuth from '../../../hooks/useAuth';
import { imageUpload } from '../../../api/utils';
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddRoom = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { user } = useAuth()
    const [imagePreview, setImagePreview] = useState()
    const [imageText, setImageText] = useState()
    const axiosSecure = useAxiosSecure()

    const [dates, setDates] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    })

    // date range handle
    const handleDates = item => {
        console.log(item);
        setDates(item.selection)
    }

    const { mutateAsync } = useMutation({
        mutationFn: async roomData => {
            const { data } = await axiosSecure.post('/rooms', roomData)
            return data
        },
        onSuccess: () => {
            setLoading(false)

            toast.success("Room Added Successfully")
            navigate('/dashboard/my-listings')
        }
    })



    // from handler
    const handleSubmit = async e => {
        e.preventDefault()
        const form = e.target;
        setLoading(true)

        const location = form.location.value;
        const category = form.category.value;
        const title = form.title.value;
        const to = dates.endDate
        const from = dates.startDate
        const price = form.price.value;
        const guests = form.total_guest.value;
        const bathrooms = form.bathrooms.value;
        const description = form.description.value;
        const bedrooms = form.bedrooms.value;
        const image = form.image.files[0]
        const host = {
            name: user?.displayName,
            image: user?.photoURL,
            email: user?.email,

        }

        try {
            const image_url = await imageUpload(image)
            const roomData = {
                location, category, title, to, from, price, guests, bathrooms, host, description, bedrooms, image: image_url
            }
            console.table(roomData)


            // post request to the server
            await mutateAsync(roomData)
        } catch (err) {
            console.log(err);
            toast.error(err.message)
            setLoading(false)
        }


    }

    // handle image change
    const handleImage = image => {
        setImagePreview(URL.createObjectURL(image))
        setImageText(image.name)
    }

    return (
        <div>
            <Helmet>
                <title>Add Room | Dashboard</title>
            </Helmet>

            {/* add from */}
            <AddRoomForm
                dates={dates}
                handleDates={handleDates}
                handleSubmit={handleSubmit}
                setImagePreview={setImagePreview}
                imagePreview={imagePreview}
                handleImage={handleImage}
                imageText={imageText}
                loading={loading}
            ></AddRoomForm>
        </div>
    );
};

export default AddRoom;