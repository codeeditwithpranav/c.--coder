const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI('AIzaSyCi2nzeGrt3AzN-4kOr-B_fvCE8jhL1puU');
// const apiKey = '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'; // Replace with your actual OpenAI API key
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prompt')
        .setDescription('Interact with GEMINI-PRO')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Enter the prompt to interact with ChatGPT')
                .setRequired(true)),
    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');
        if (!prompt) {
            return interaction.reply('Please provide your prompt to interact with ChatGPT');
        }
        try {
            await interaction.deferReply();
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            interaction.editReply(text);
           
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while processing your request.');
        }
    }
};