
<script setup>
    import { reactive } from 'vue';
    import { userRepository } from '../../repositories/user-repository';
    import { User } from '../../model/user';

    const props = defineProps({
        user: { type: Object, default: null }
    });

    const emit = defineEmits(['submitted']);

    const form = reactive({
        name: props.user?.name ?? '',
        email: props.user?.email ?? '',
        personalId: props.user?.personal_id ?? '',
    });

    const submit = () => {
        if (props.user) {
            userRepository.update(form);
        } else {
            userRepository.create(new User(form));
        }
        emit('submitted');
    };
</script>

<template>
    <div class="mx-auto max-w-132 space-y-3">
        <div
            class="rounded-3xl border border-[#e4e9ef] bg-white p-5 shadow-sm"
        >
            <div class="space-y-5">
                <div>
                    <label
                        for="name"
                        class="mb-2 block pl-0.5 text-[11px] font-extrabold tracking-[1px] text-[#7f96b2]"
                    >
                        MENO
                    </label>

                    <input
                        id="name"
                        v-model="form.name"
                        type="text"
                        placeholder="Napr. Ján Novák"
                        class="w-full rounded-2xl border border-[#e5ebf2] bg-white px-5 py-4.5 text-base font-semibold text-[#0b1d35] shadow-sm outline-none placeholder:font-normal placeholder:text-[#c5cbd2] focus:border-[#e30613]"
                    />
                </div>

                <div>
                    <label
                        for="email"
                        class="mb-2 block pl-0.5 text-[11px] font-extrabold tracking-[1px] text-[#7f96b2]"
                    >
                        EMAIL
                    </label>

                    <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        placeholder="Napr. jan.novak@dpb.sk"
                        class="w-full rounded-2xl border border-[#e5ebf2] bg-white px-5 py-4.5 text-base font-semibold text-[#0b1d35] shadow-sm outline-none placeholder:font-normal placeholder:text-[#c5cbd2] focus:border-[#e30613]"
                    />
                </div>

                <div>
                    <label
                        for="personalId"
                        class="mb-2 block pl-0.5 text-[11px] font-extrabold tracking-[1px] text-[#7f96b2]"
                    >
                        PERSONAL ID
                    </label>

                    <input
                        id="personalId"
                        v-model="form.personalId"
                        type="text"
                        placeholder="Napr. 123456"
                        class="w-full rounded-2xl border border-[#e5ebf2] bg-white px-5 py-4.5 text-base font-semibold text-[#0b1d35] shadow-sm outline-none placeholder:font-normal placeholder:text-[#c5cbd2] focus:border-[#e30613]"
                    />
                </div>
            </div>
        </div>

        <button
            type="button"
            class="w-full rounded-2xl bg-[#e30613] px-5 py-.5 text-lg font-extrabold text-white shadow-sm transition hover:bg-[#d60512]"
            @click="submit"
        >
            VYTVORIŤ USERA
        </button>
    </div>
</template>
