<template>
	<Dialog
		v-model="show"
		:options="{
			title: __('Create a Live Class'),
			size: 'xl',
			actions: [
				{
					label: 'Submit',
					variant: 'solid',
					onClick: ({ close }) => submitLiveClass(close),
				},
			],
		}"
	>
		<template #body-content>
			<div class="flex flex-col gap-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-4">
						<FormControl
							type="text"
							v-model="liveClass.title"
							:label="__('Title')"
							:required="true"
						/>
						<FormControl
							v-model="liveClass.date"
							type="date"
							:label="__('Date')"
							:required="true"
						/>
						<Tooltip :text="__('Duration of the live class in minutes')">
							<FormControl
								type="number"
								v-model="liveClass.duration"
								:label="__('Duration')"
								:required="true"
							/>
						</Tooltip>
					</div>
					<div class="space-y-4">
						<Tooltip
							:text="
								__(
									'Time must be in 24 hour format (HH:mm). Example 11:30 or 22:00'
								)
							"
						>
							<FormControl
								v-model="liveClass.time"
								type="time"
								:label="__('Time')"
								:required="true"
							/>
						</Tooltip>

						<div class="space-y-1.5">
							<label class="block text-ink-gray-5 text-xs" for="batchTimezone">
								{{ __('Timezone') }}
								<span class="text-ink-red-3">*</span>
							</label>
							<Autocomplete
								@update:modelValue="(opt) => (liveClass.timezone = opt.value)"
								:modelValue="liveClass.timezone"
								:options="getTimezoneOptions()"
								:required="true"
							/>
						</div>
						<FormControl
							v-model="liveClass.auto_recording"
							type="select"
							:options="getRecordingOptions()"
							:label="__('Auto Recording')"
						/>
					</div>
				</div>
				<FormControl
					v-model="liveClass.description"
					type="textarea"
					:label="__('Description')"
				/>
			</div>
		</template>
	</Dialog>
</template>
<script setup>
import {
	Dialog,
	createResource,
	Tooltip,
	FormControl,
	Autocomplete,
	toast,
} from '@mono/mono-frappe-ui'
import { reactive, inject, onMounted } from 'vue'
import { getTimezones, getUserTimezone } from '@/utils/'

const liveClasses = defineModel('reloadLiveClasses')
const show = defineModel()
const user = inject('$user')
const dayjs = inject('$dayjs')

const props = defineProps({
	batch: {
		type: String,
		required: true,
	},
	zoomAccount: {
		type: String,
		required: true,
	},
})

let liveClass = reactive({
	title: '',
	description: '',
	date: '',
	time: '',
	duration: '',
	timezone: '',
	auto_recording: 'No Recording',
	batch: props.batch,
	host: user.data.name,
})

onMounted(() => {
	liveClass.timezone = getUserTimezone()
})

const getTimezoneOptions = () => {
	return getTimezones().map((timezone) => {
		return {
			label: timezone,
			value: timezone,
		}
	})
}

const getRecordingOptions = () => {
	return [
		{
			label: 'No Recording',
			value: 'No Recording',
		},
		{
			label: 'Local',
			value: 'Local',
		},
		{
			label: 'Cloud',
			value: 'Cloud',
		},
	]
}

const createLiveClass = createResource({
	url: 'lms.lms.doctype.lms_batch.lms_batch.create_live_class',
	makeParams(values) {
		return {
			doctype: 'LMS Live Class',
			batch_name: values.batch,
			zoom_account: props.zoomAccount,
			...values,
		}
	},
})

const submitLiveClass = (close) => {
	return createLiveClass.submit(liveClass, {
		validate() {
			validateFormFields()
		},
		onSuccess() {
			liveClasses.value.reload()
			refreshForm()
			close()
		},
		onError(err) {
			toast.error(err.messages?.[0] || err)
		},
	})
}

const validateFormFields = () => {
	if (!liveClass.title) {
		return __('Please enter a title.')
	}
	if (!liveClass.date) {
		return __('Please select a date.')
	}
	if (!liveClass.time) {
		return __('Please select a time.')
	}
	if (!liveClass.timezone) {
		return __('Please select a timezone.')
	}
	if (!valideTime()) {
		return __('Please enter a valid time in the format HH:mm.')
	}
	const liveClassDateTime = dayjs(`${liveClass.date}T${liveClass.time}`).tz(
		liveClass.timezone,
		true
	)
	if (
		liveClassDateTime.isSameOrBefore(
			dayjs().tz(liveClass.timezone, false),
			'minute'
		)
	) {
		return __('Please select a future date and time.')
	}
	if (!liveClass.duration) {
		return __('Please select a duration.')
	}
}

const valideTime = () => {
	let time = liveClass.time.split(':')
	if (time.length != 2) {
		return false
	}
	if (time[0] < 0 || time[0] > 23) {
		return false
	}
	if (time[1] < 0 || time[1] > 59) {
		return false
	}
	return true
}

const refreshForm = () => {
	liveClass.title = ''
	liveClass.description = ''
	liveClass.date = ''
	liveClass.time = ''
	liveClass.duration = ''
	liveClass.timezone = getUserTimezone()
	liveClass.auto_recording = 'No Recording'
}
</script>
